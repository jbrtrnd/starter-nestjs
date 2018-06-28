import { Controller } from '@nestjs/common';
import RestController from '../../starter/rest/controller/rest.controller';
import Foo from '../entity/foo.entity';
import FooService from '../service/foo.service';

@Controller('foo')
export default class FooController extends RestController<Foo> {
    constructor(protected service: FooService) {
        super(service);
    }
}
