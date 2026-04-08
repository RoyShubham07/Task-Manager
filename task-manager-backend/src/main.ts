import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = process.env.FRONTEND_URL?.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors(
    corsOrigins?.length ? { origin: corsOrigins } : { origin: true },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
