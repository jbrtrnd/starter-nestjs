import { Controller } from '@nestjs/common';
import { Connection } from 'typeorm';
import RestController from 'starter/rest/rest.controller';
import Bar from '../entity/bar.entity';

@Controller('bar')
export default class BarController extends RestController<Bar> {
    constructor(protected entityManager: Connection) {
        super(Bar, entityManager);
    }
}
