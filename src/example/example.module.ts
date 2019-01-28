import { Module } from '@nestjs/common';
import { StarterModule } from '../starter/starter.module';
import { UserModule } from '../user/user.module';
import BarController from './controller/bar.controller';
import FooController from './controller/foo.controller';
@Module({
    imports: [StarterModule, UserModule],
    controllers: [BarController, FooController],
    providers: [],
})
export class ExampleModule {}
