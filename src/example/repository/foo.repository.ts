import { EntityRepository } from 'typeorm';
import RestRepository from '../../starter/rest/repository/rest.repository';
import Foo from '../entity/foo.entity';

@EntityRepository(Foo)
export default class FooRepository extends RestRepository<Foo> {}
