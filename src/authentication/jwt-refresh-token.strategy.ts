import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UsersService } from '../users/users.service'
import TokenPayload from './tokenPayload.interface'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.get('Authorization').replace('Bearer', '').trim()
    if (!payload.userId)
      throw new HttpException('User with that email already exists', HttpStatus.UNAUTHORIZED)

    const valid = await this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.userId)
    return valid
  }
}
