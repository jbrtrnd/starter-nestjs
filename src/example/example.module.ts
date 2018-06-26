import { Module } from '@nestjs/common';
import BarController from './controller/bar.controller';

@Module({
    imports: [],
    controllers: [BarController],
    providers: [],
})
export class ExampleModule {}
