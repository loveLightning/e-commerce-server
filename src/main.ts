import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './models/app/app.module'
import { PrismaService } from './services/prisma/prisma.service'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // app.enableCors({
  //   origin: true,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  //   allowedHeaders: ['authorization', 'content-type'],
  // })

  app.enableCors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['authorization', 'content-type'],
  })

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    )
    res.header('Access-Control-Allow-Credentials', 'true')
    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
      res.header('Access-Control-Allow-Origin', req.headers.origin)
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With',
      )
      res.header('Access-Control-Allow-Credentials', 'true')
      res.sendStatus(200)
    } else {
      next()
    }
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  // app.use((req, res, next) => {
  //   res.setHeader('Access-Control-Allow-Origin', '*')
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  //   res.header(
  //     'Access-Control-Allow-Headers Access-Control-Allow-Origin',
  //     'Content-Type, Authorization, Content-Length, X-Requested-With',
  //   )
  //   // intercept OPTIONS method
  //   if ('OPTIONS' === req.method) {
  //     res.sendStatus(200)
  //   } else {
  //     next()
  //   }
  // })

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
