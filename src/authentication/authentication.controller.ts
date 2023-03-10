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
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData)
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  @ApiBody({ type: LogInDto })
  @UsePipes(ValidationPipe)
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    console.log('[logIn]', 'sdfsdfsdfsdf')
    const { user } = request

    const accessToken = this.authenticationService.getJwtToken(user.id)
    response.setHeader('Authorization', `Bearer ${accessToken}`)
    user.password = undefined
    this.logger.log('[login]', user)
    return response.send(user)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Res() response: Response) {
    response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut())
    return response.sendStatus(200)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user
    user.password = undefined
    return user
  }
}
