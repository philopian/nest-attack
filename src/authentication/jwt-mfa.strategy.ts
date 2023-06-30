import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UsersService } from '../users/users.service'
import TokenPayload from './tokenPayload.interface'

@Injectable()
export class JwtMfaStrategy extends PassportStrategy(Strategy, 'jwt-mfa') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: TokenPayload) {
    const user = await this.userService.getById(payload.userId)
    if (!user.isMfaAuthEnabled) {
      return user
    }
    if (payload.isSecondFactorAuthenticated) {
      return user
    }
  }
}
