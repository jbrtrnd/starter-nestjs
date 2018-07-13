import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleModule } from './example/example.module';
import environment from './environment';
import { StarterModule } from './starter/starter.module';

@Module({
    imports: [TypeOrmModule.forRoot(environment.typeorm), ExampleModule, StarterModule],
    controllers: [],
    providers: [],
})
export class BootstrapModule {}
