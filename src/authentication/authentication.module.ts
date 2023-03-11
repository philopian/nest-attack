import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UsersModule } from '../users/users.module'
import { UsersService } from '../users/users.service'
import { PrismaService } from '../utils/prisma/prisma.service'
import { AuthenticationController } from './authentication.controller'
import { AuthenticationService } from './authentication.service'
import { JwtTwoFactorStrategy } from './jwt-two-factor.strategy'
import { JwtStrategy } from './jwt.strategy'
import { LocalStrategy } from './local.strategy'
import { TwoFactorAuthenticationController } from './two-factor/two-factor-auth.controller'
import { TwoFactorAuthenticationService } from './two-factor/two-factor-auth.service'

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
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
    UsersService,
    PrismaService,
  ],
  controllers: [AuthenticationController, TwoFactorAuthenticationController],
})
export class AuthenticationModule {}
