import { Repository } from 'typeorm';
import RestEntity from './rest.entity';
import Criterion from './search/criterion';
import Order from './search/order';
import Pager from './search/pager';

export default class RestRepository<T extends RestEntity> extends Repository<T> {

    search(criteria: Criterion[] = [], orders: Order[] = [], mode: 'and' | 'or' = 'and', pager: Pager = null) {
        const queryBuilder = this.createQueryBuilder('o');
        queryBuilder.select('o');

        const modeFn = mode + 'Where';
        criteria.forEach((criterion: Criterion) => {
            queryBuilder[modeFn](criterion.toSQL());
            queryBuilder.setParameter(criterion.parameter, criterion.value);
        });

        orders.forEach((order: Order) => {
            queryBuilder.addOrderBy(order.property, (order.isASC() ? 'ASC' : 'DESC'));
        });

        if (pager) {
            queryBuilder.offset(pager.offset);
            queryBuilder.limit(pager.limit);
        }

        return queryBuilder.getMany();
    }
}
