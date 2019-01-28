import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RestModule } from './rest/rest.module';

@Module({
    imports: [DatabaseModule, RestModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class StarterModule {
}
