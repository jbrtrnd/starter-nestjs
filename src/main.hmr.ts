import { NestFactory } from '@nestjs/core';
import { BootstrapModule } from './bootstrap.module';
import { HttpExceptionFilter } from './starter/rest/exception/filter/http-exception.filter';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(BootstrapModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
