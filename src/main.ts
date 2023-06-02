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
      'https://e-commerce-client-and-admin-client.vercel.app',
      'https://e-commerce-client-and-admin-admin.vercel.app',
    ],
    preflightContinue: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    // allowedHeaders: ['uthorization', 'content-type'],
  })

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL)
    res.header('Access-Control-Allow-Credentials', true)

    if (req.method === 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET',
      )
      return res.status(200).json({})
    }
    next()
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
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
