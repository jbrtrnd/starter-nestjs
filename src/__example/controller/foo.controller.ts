import { Controller, Get } from '@nestjs/common';
import RestController from '../../starter/rest/controller/rest.controller';
import RestServiceFactory from '../../starter/rest/factory/rest-service.factory';
import Foo from '../entity/foo.entity';

@Controller('foo')
export default class FooController extends RestController<Foo> {
    constructor(protected factory: RestServiceFactory) {
        super(factory.createService<Foo>(Foo));
    }

    @Get()
    search(request, response): void {
        super.search(request, response);
    }
}
