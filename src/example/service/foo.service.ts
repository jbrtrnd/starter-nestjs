import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import RestService from '../../starter/rest/service/rest.service';
import Foo from '../entity/foo.entity';
import FooRepository from '../repository/foo.repository';

@Injectable()
export default class FooService extends RestService<Foo> {
    constructor(protected entityManager: Connection) {
        super(Foo, FooRepository, entityManager);
    }
}
