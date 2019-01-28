import { NestFactory } from '@nestjs/core';
import { BootstrapModule } from './bootstrap.module';
import { useContainer } from 'class-validator';

async function bootstrap() {
    const app = await NestFactory.create(BootstrapModule);
    useContainer(app.select(BootstrapModule), { fallbackOnErrors: true });
    await app.listen(3000);
}
bootstrap();
