import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import express from 'express';

let cachedServer: any; // Cache the server to avoid cold starts on every request

async function bootstrapServer() {
  // Create an Express instance
  const expressApp = express();

  // Attach NestJS to Express
  const adapter = new ExpressAdapter(expressApp);
  const nestApp = await NestFactory.create(AppModule, adapter);

  await nestApp.init();

  // Wrap the Express app with serverless-http
  return serverless(expressApp);
}

// Lambda handler
export const handler = async (event: any, context: any) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }

  return cachedServer(event, context);
};
