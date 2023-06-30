import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UsersModule } from '../users/users.module'
import { UsersService } from '../users/users.service'
import { PrismaService } from '../utils/prisma/prisma.service'
import { AuthenticationController } from './authentication.controller'
import { AuthenticationService } from './authentication.service'
import { JwtMfaStrategy } from './jwt-mfa.strategy'
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy'
import { JwtStrategy } from './jwt.strategy'
import { LocalStrategy } from './local.strategy'
import { MfaAuthenticationController } from './mfa/mfa-auth.controller'
import { MfaAuthenticationService } from './mfa/mfa-auth.service'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    MfaAuthenticationService,
    JwtMfaStrategy,
    UsersService,
    PrismaService,
  ],
  controllers: [AuthenticationController, MfaAuthenticationController],
})
export class AuthenticationModule {}
