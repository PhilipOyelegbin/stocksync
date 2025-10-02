import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:3030',
        'https://philipoyelegbin.com.ng',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Stock Sync API')
    .setDescription(
      'Retailers and warehouses struggle with stockouts and overstocking due to poor visibility into inventory across multiple locations. They need a backend API that provides real-time inventory tracking and predictive restocking.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
  SwaggerModule.setup('/', app, documentFactory, {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
    customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running...`);
}
bootstrap();
