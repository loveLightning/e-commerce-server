import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './models/app/app.module'
import { PrismaService } from './services/prisma/prisma.service'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: [
      process.env.CLIENT_URL,
      process.env.ADMIN_URL,
      'https://videohosting-next-js-nest-js-admin-86btbkj8n-zaycevnet20.vercel.app',
      'https://videohosting-next-js-nest-js-client-j3hpnrztb-zaycevnet20.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['authorization', 'content-type'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
  })

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
  })

  app.useGlobalPipes(
    new ValidationPipe(/* {
      transform: true, 
    } */),
  )
  app.use(cookieParser())

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)
  await app.listen(process.env.PORT || 4000)
}
bootstrap()
