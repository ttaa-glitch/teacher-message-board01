import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '0.0.0.0';

  // 生产环境托管前端静态文件
  if (process.env.NODE_ENV === 'production') {
    const clientDist = join(process.cwd(), 'dist/client');
    app.useStaticAssets(clientDist);

    // SPA 路由回退
    app.use((req: any, res: any, next: any) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      const fs = require('fs');
      const indexPath = join(clientDist, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
      return next();
    });
  }

  await app.listen(port, host);
  const logger = new Logger('Bootstrap');
  logger.log(`Server running on ${host}:${port}`);
  logger.log(`API endpoints ready at http://${host}:${port}/api`);
}

bootstrap();
