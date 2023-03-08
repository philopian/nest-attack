import { NestFactory } from '@nestjs/core'
import * as dotenv from 'dotenv'

import { AppModule } from './app.module'

dotenv.config()

const PORT = process.env.PORT || 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  console.log(`⚡ The magic happens at: http://localhost:${PORT}`)
  await app.listen(PORT)
}
bootstrap()
