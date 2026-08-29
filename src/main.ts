import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { GlobalHttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformResponseInterceptor } from "./common/interceptors/transform-response.interceptor";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  // Prefix toàn cầu cho API versioning
  app.setGlobalPrefix("api/v1");

  // Middlewares
  app.use(cookieParser());

  // CORS cho Frontend (Next.js)
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  });

  // Global Validation Pipe với whitelist
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global Interceptor & Exception Filter
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle("InviteMe Backend API")
    .setDescription("Nền tảng thiệp cưới điện tử thông minh & sang trọng")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`InviteMe Backend is running on: http://localhost:${port}/api/v1`);
  logger.log(`Swagger OpenAPI documentation at: http://localhost:${port}/api/docs`);
}
bootstrap();