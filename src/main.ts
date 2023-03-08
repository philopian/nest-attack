import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const PORT = configService.get('PORT') ?? 3000
  console.log(`⚡ The magic happens at: http://localhost:${PORT}`)
  await app.listen(PORT)
}
bootstrap()
