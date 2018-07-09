import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleModule } from './example/example.module';
import environment from './environment';
import { UserModule } from './user/user.module';

@Module({
    imports: [TypeOrmModule.forRoot(environment.typeorm), UserModule, ExampleModule],
    controllers: [],
    providers: [],
})
export class BootstrapModule {}
