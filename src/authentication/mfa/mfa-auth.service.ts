import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { authenticator } from 'otplib'
import { toFileStream } from 'qrcode'

import { User } from '../../users/users.interface'
import { UsersService } from '../../users/users.service'

@Injectable()
export class MfaAuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  public async generateMfaAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret()

    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('MFA_AUTHENTICATION_APP_NAME'),
      secret,
    )

    await this.usersService.setMfaAuthenticationSecret(secret, user.id)

    return {
      secret,
      otpauthUrl,
    }
  }

  public isMfaAuthenticationCodeValid(mfaAuthenticationCode: string, user: User) {
    console.log({
      token: mfaAuthenticationCode,
      secret: user.mfaAuthSecret,
    })
    return authenticator.verify({
      token: mfaAuthenticationCode,
      secret: user.mfaAuthSecret,
    })
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl)
  }
}
