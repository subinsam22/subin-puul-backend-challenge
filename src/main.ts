import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const docConfig = new DocumentBuilder()
  .setTitle("Puul Task Management API")
  .setDescription("API for managing team tasks, users, and analytics.")
  .setVersion("1.0")
  .addTag('users')
  .addTag('tasks')
  .build()
  const document = SwaggerModule.createDocument(app,docConfig)
  SwaggerModule.setup('api',app,document)

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true,
    transformOptions: {
    enableImplicitConversion: true, 
  },
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
