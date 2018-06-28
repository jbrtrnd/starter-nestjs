import { Controller } from '@nestjs/common';
import RestController from '../../starter/rest/controller/rest.controller';
import Bar from '../entity/bar.entity';
import BarService from '../service/bar.service';

@Controller('bar')
export default class BarController extends RestController<Bar> {
    constructor(protected service: BarService) {
        super(service);
    }
}
