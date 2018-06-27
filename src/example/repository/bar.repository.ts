import { EntityRepository } from 'typeorm';
import RestRepository from '../../starter/rest/rest.repository';
import Bar from '../entity/bar.entity';

@EntityRepository(Bar)
export default class BarRepository extends RestRepository<Bar> {}