import * as Joi from '@hapi/joi'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthenticationModule } from './authentication/authentication.module'
import { QuotesModule } from './quotes/quotes.module'
import { UsersModule } from './users/users.module'

const EnvModule = ConfigModule.forRoot({
  envFilePath: ['.env.local', '.env'],
})

@Module({
  imports: [
    EnvModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),

        PORT: Joi.number(),
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
