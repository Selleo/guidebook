import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { patchNestJsSwagger, applyFormats } from "nestjs-typebox";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { exportSchemaToFile } from "./utils/save-swagger-to-file";

patchNestJsSwagger();
applyFormats();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Guidebook API")
    .setDescription("Example usage of Swagger with Typebox")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  exportSchemaToFile(document);

  await app.listen(3000);
}
bootstrap();
