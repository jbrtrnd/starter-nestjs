import { NestFactory } from '@nestjs/core';
import { BootstrapModule } from './bootstrap.module';
import { HttpExceptionFilter } from './starter/rest/exception/filter/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(BootstrapModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(3000);
}
bootstrap();
