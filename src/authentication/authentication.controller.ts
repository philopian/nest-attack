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

import { AuthenticationService } from './authentication.service'
import LogInDto from './dto/logIn.dto'
import RegisterDto from './dto/register.dto'
import JwtAuthenticationGuard from './jwt-authentication.guard'
import { LocalAuthenticationGuard } from './localAuthentication.guard'
import RequestWithUser from './requestWithUser.interface'

@Controller('authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationService.name)
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto, @Res() response: Response) {
    const userInfo = await this.authenticationService.register(registrationData)
    delete userInfo.isTwoFactorAuthEnabled
    delete userInfo.twoFactorAuthSecret

    const accessToken = this.authenticationService.getJwtToken(userInfo.id)
    response.setHeader('Authorization', `Bearer ${accessToken}`)

    return response.send({
      message: 'Multifactor authentication required',
      mfa_token: accessToken,
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

    if (user.isTwoFactorAuthEnabled) {
      return response.send({
        title: 'mfa_required',
        description: 'Multifactor authentication required',
        mfa_token: accessToken,
      })
    }
    return response.send({ ...user, accessToken })
  }

  // TODO: Implement this!!
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Res() response: Response) {
    // response.setHeader('Authorization', "")
    return response.sendStatus(200)
  }

  // @UseGuards(JwtAuthenticationGuard)
  // @Get()
  // authenticate(@Req() request: RequestWithUser) {
  //   const user = request.user
  //   user.password = undefined
  //   return user
  // }
}
