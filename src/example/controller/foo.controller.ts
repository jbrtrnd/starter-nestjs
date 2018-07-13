import { Controller, Get, UseGuards } from '@nestjs/common';
import RestController from '../../starter/rest/controller/rest.controller';
import RestServiceFactory from '../../starter/rest/factory/rest-service.factory';
import AuthGuard from '../../user/guard/auth.guard';
import Foo from '../entity/foo.entity';

@Controller('foo')
export default class FooController extends RestController<Foo> {
    constructor(protected factory: RestServiceFactory) {
        super(factory.createService<Foo>(Foo));
    }

    @UseGuards(AuthGuard)
    @Get()
    search(request, response): void {
        super.search(request, response);
    }
}
