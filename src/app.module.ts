import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'

import { AuthenticationModule } from './authentication/authentication.module'
import { QuotesModule } from './quotes/quotes.module'
import { UsersModule } from './users/users.module'

const EnvModule = ConfigModule.forRoot({
  envFilePath: ['.env.dev', '.env'],
})

@Module({
  imports: [
    EnvModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        MFA_AUTHENTICATION_APP_NAME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
      }),
    }),
    AuthenticationModule,
    UsersModule,
    QuotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
