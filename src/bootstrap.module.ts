import { Module } from '@nestjs/common';
import { ExampleModule } from './example/example.module';
import { StarterModule } from './starter/starter.module';

@Module({
    imports: [StarterModule, ExampleModule],
    controllers: [],
    providers: [],
})
export class BootstrapModule {
}
