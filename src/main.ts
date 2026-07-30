// import { NestFactory } from '@nestjs/core';
// // import { AppModule } from './app.module';
// import { UsersModule } from './users/users.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(UsersModule);
//   app.useGlobalPipes(
//     // binding ValidationPipe at the application level, thus ensuring all endpoints are protected from receiving incorrect data.
//     new ValidationPipe({
//       whitelist: true, // If set to true, validator will strip validated (returned) object of any properties that do not use any validation decorators.
//       forbidNonWhitelisted: true, // If set to true, instead of stripping non-whitelisted properties validator will throw an exception.
//       transform: true, // automatically transform payloads to be objects typed according to their DTO classes
//     }),
//   );
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
