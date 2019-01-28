import { Controller } from '@nestjs/common';
import RestController from '../../starter/rest/controller/rest.controller';
import RestServiceFactory from '../../starter/rest/factory/rest-service.factory';
import Bar from '../entity/bar.entity';

@Controller('bar')
export default class BarController extends RestController<Bar> {
    constructor(protected factory: RestServiceFactory) {
        super(factory.createService<Bar>(Bar));
    }
}
