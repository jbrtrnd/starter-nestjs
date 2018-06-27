import { Repository } from 'typeorm';
import RestEntity from './rest.entity';
import Criterion from './search/criterion';
import Pager from './search/pager';

export default class RestRepository<T extends RestEntity> extends Repository<T> {
    search(criteria: Criterion[], pager: Pager) {
        const queryBuilder = this.createQueryBuilder('o');
        queryBuilder.select('o');

        criteria.forEach((criterion: Criterion) => {
            queryBuilder.andWhere(criterion.toSQL());
            queryBuilder.setParameter(criterion.parameter, criterion.value);
        });

        queryBuilder.offset(pager.offset);
        queryBuilder.limit(pager.limit);

        return queryBuilder.getMany();
    }
}
