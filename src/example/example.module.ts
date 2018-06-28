import { Module } from '@nestjs/common';
import BarController from './controller/bar.controller';
import FooController from './controller/foo.controller';
import BarService from './service/bar.service';
import FooService from './service/foo.service';

@Module({
    imports: [],
    controllers: [BarController, FooController],
    providers: [BarService, FooService],
})
export class ExampleModule {}
