import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('ProofPass API')
    .setDescription('Blockchain-powered event attendance verification API')
    .setVersion('1.0')
    // .addBearerAuth()
    .addTag('Authentication', 'Wallet-based authentication endpoints')
    .addTag('Events', 'Event management endpoints')
    .addTag('Attendances', 'Check-in and attendance verification')
    .addTag('Analytics', 'Event analytics and reporting')
    .addTag('Users', 'User profile management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .addServer('http://localhost:3000', 'Local development')
    .addServer('https://proofpass.onrender.com/', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      // persistAuthorization: true,
      docExpansion: 'none',
      filter: true, 
      tagsSorter: 'alpha',
    },
  });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
