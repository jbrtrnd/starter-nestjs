import { Module } from '@nestjs/common';
import { StarterModule } from '../starter/starter.module';
import BarController from './controller/bar.controller';
import FooController from './controller/foo.controller';

@Module({
    imports: [StarterModule],
    controllers: [BarController, FooController],
    providers: [],
})
export class ExampleModule {
}
