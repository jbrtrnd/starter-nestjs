import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleModule } from './example/example.module';
import { StarterModule } from './starter/starter.module';
import environment from './environment';

@Module({
    imports: [TypeOrmModule.forRoot(environment.typeorm), StarterModule, ExampleModule],
    controllers: [],
    providers: [],
})
export class BootstrapModule {}
