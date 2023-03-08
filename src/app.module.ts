import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { QuotesModule } from './quotes/quotes.module'

const EnvModule = ConfigModule.forRoot({
  envFilePath: ['.env.local', '.env'],
})

@Module({
  imports: [EnvModule, QuotesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
