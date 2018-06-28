import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import RestService from '../../starter/rest/service/rest.service';
import Bar from '../entity/bar.entity';
import BarRepository from '../repository/bar.repository';

@Injectable()
export default class BarService extends RestService<Bar> {
    constructor(protected entityManager: Connection) {
        super(Bar, BarRepository, entityManager);
    }
}
