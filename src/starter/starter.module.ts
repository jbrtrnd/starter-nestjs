import { Module } from '@nestjs/common';
import RestServiceFactory from './rest/factory/rest-service.factory';

@Module({
    imports: [],
    controllers: [],
    providers: [RestServiceFactory],
    exports: [RestServiceFactory],
})
export class StarterModule {}
