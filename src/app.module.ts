import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { QuotesModule } from './quotes/quotes.module'
import { UsersModule } from './users/users.module';

const EnvModule = ConfigModule.forRoot({
  envFilePath: ['.env.local', '.env'],
})

@Module({
  imports: [EnvModule, QuotesModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
