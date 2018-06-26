import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleModule } from './example/example.module';
import { StarterModule } from './starter/starter.module';

@Module({
    imports: [TypeOrmModule.forRoot(), StarterModule, ExampleModule],
    controllers: [],
    providers: [],
})
export class BootstrapModule {}
