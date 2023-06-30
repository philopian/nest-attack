import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  Req,
  Body,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common'
import { Response } from 'express'

import { UsersService } from '../../users/users.service'
import { AuthenticationService } from '../authentication.service'
import JwtAuthenticationGuard from '../jwt-authentication.guard'
import RequestWithUser from '../requestWithUser.interface'
import { MfaAuthenticationCodeDto } from './dto/mfa-auth-code.dto'
import { MfaAuthenticationService } from './mfa-auth.service'

@Controller('mfa')
@UseInterceptors(ClassSerializerInterceptor)
export class MfaAuthenticationController {
  constructor(
    private readonly mfaAuthenticationService: MfaAuthenticationService,
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthenticationGuard)
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    const { otpauthUrl } = await this.mfaAuthenticationService.generateMfaAuthenticationSecret(
      request.user,
    )

    return this.mfaAuthenticationService.pipeQrCodeStream(response, otpauthUrl)
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async turnOnMfaAuthentication(
    @Req() request: RequestWithUser,
    @Body() { mfaAuthenticationCode }: MfaAuthenticationCodeDto,
  ) {
    const isCodeValid = this.mfaAuthenticationService.isMfaAuthenticationCodeValid(
      mfaAuthenticationCode,
      request.user,
    )
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code')
    }
    await this.usersService.turnOnMfaAuthentication(request.user.id)
    return {
      message: `MFA Auth is enabled for user ${request.user.email}`,
    }
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { mfaAuthenticationCode }: MfaAuthenticationCodeDto,
  ) {
    const isCodeValid = this.mfaAuthenticationService.isMfaAuthenticationCodeValid(
      mfaAuthenticationCode,
      request.user,
    )
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code')
    }

    const accessToken = this.authenticationService.getJwtAccessTokenWithMFA(request.user.id, true)

    request.res.setHeader('Authorization', `Bearer ${accessToken}`)

    const { id, email, name } = request.user
    return {
      accessToken,
      data: {
        id,
        email,
        name,
      },
    }
  }
}
