import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL', 'TWILIO_PHONE_NUMBER'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  const app = await NestFactory.create(AppModule);

  // CORS — allow portal and member app
  app.enableCors({
    origin: [
      'https://app.rockwellhomemanagement.com',
      'https://portal.rockwellhomemanagement.com',
      'https://rockwellhomemanagement.com',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Swagger API docs
  const config = new DocumentBuilder()
    .setTitle('Rockwell Home Management API')
    .setDescription('Backend API for the Rockwell Digital Shield platform')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req: any, res: any) => {
    res.json({
      status: 'ok',
      service: 'rockwell-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🏠 Rockwell API running on port ${port}`);
  console.log(`📋 Swagger docs at /api/docs`);
}

bootstrap();
