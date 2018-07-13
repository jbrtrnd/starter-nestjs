import { Module } from '@nestjs/common';
import RestServiceFactory from './rest/factory/rest-service.factory';
import { EntityExists } from './rest/validator/entity-exists';

@Module({
    imports: [],
    controllers: [],
    providers: [RestServiceFactory, EntityExists],
    exports: [RestServiceFactory],
})
export class StarterModule {}
