import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'
import { Response } from 'express'

import { UsersService } from '../users/users.service'
import { AuthenticationService } from './authentication.service'
import LogInDto from './dto/logIn.dto'
import RegisterDto from './dto/register.dto'
import JwtAuthenticationGuard from './jwt-authentication.guard'
import JwtRefreshGuard from './jwt-refresh.guard'
import { LocalAuthenticationGuard } from './localAuthentication.guard'
import RequestWithUser from './requestWithUser.interface'

@Controller('auth')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationService.name)
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto, @Res() response: Response) {
    const userInfo = await this.authenticationService.register(registrationData)
    delete userInfo.isMfaAuthEnabled
    delete userInfo.mfaAuthSecret

    const accessToken = this.authenticationService.getJwtToken(userInfo.id)
    response.setHeader('Authorization', `Bearer ${accessToken}`)

    const refreshToken = await this.authenticationService.getJwtRefreshToken(userInfo.id)
    await this.usersService.setCurrentRefreshToken(refreshToken, userInfo.id)

    return response.send({
      message: 'Multifactor authentication required',
      mfa_token: accessToken,
      refreshToken,
      data: { ...userInfo },
    })
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @ApiBody({ type: LogInDto })
  @UsePipes(ValidationPipe)
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request

    const accessToken = this.authenticationService.getJwtToken(user.id)
    response.setHeader('Authorization', `Bearer ${accessToken}`)
    user.password = undefined
    this.logger.log('[login]', user)

    const refreshToken = await this.authenticationService.getJwtRefreshToken(user.id)
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id)

    // TODO: Check to see if user has mfa enabled

    if (user.isMfaAuthEnabled) {
      return response.send({
        title: 'mfa_required',
        description: 'Multifactor authentication required',
        mfa_token: accessToken,
        refreshToken,
      })
    }
    return response.send({ id: user.id, accessToken, refreshToken })
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    await this.usersService.removeRefreshToken(request.user.id)
    return response.sendStatus(200)
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const refreshToken = this.authenticationService.getJwtRefreshToken(request.user.id)
    const accessToken = this.authenticationService.getJwtToken(request.user.id)

    const { id } = request.user
    return {
      id,
      accessToken,
      refreshToken,
    }
  }
}
