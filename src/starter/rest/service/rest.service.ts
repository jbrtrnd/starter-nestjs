import { Connection, Repository } from 'typeorm';
import RestEntity from '../entity/rest.entity';
import NotFoundException from '../exception/not-found.exception';
import Criterion from './search/criterion';
import Join from './search/join';
import Order from './search/order';
import Pager from './search/pager';

/**
 * Basic starter REST service used to manage an entity with the database.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default class RestService<T extends RestEntity> {
    /**
     * Entity repository.
     * @type {Repository}
     */
    protected repository: Repository<T>;

    /**
     * @param {{new(): RestEntity}} entityClass
     * @param {Connection}          entityManager
     */
    constructor(protected entityClass: new () => T, protected entityManager: Connection) {
        this.repository = this.entityManager.getRepository(this.entityClass);
    }

    /**
     * Search in the complete list of entities.
     *
     * @param {Criterion[]}  criteria
     * @param {string[]}     embeds
     * @param {Order[]}      orders
     * @param {Join[]}       joins
     * @param {"and" | "or"} mode
     * @param {Pager}        pager
     *
     * @returns {Promise<RestEntity>}
     */
    search(
        criteria: Criterion[] = [],
        embeds: string[] = [],
        orders: Order[] = [],
        joins: Join[] = [],
        mode: string = 'and',
        pager: Pager = null,
    ): Promise<T[]> {
        const queryBuilder = this.repository.createQueryBuilder('o');

        let firstSelect = 'o';
        const selection = [];
        embeds.forEach((property: string) => {
            if (property.indexOf('.') === -1) {
                if (!joins.some(join => {
                    return join.name === property;
                })) {
                    property = 'o.' + property;
                    firstSelect = 'o.id';
                }
            }
            selection.push(property);
        });
        queryBuilder.select(firstSelect);
        queryBuilder.addSelect(selection);

        const modeFn = mode + 'Where';
        criteria.forEach((criterion: Criterion) => {
            if (!criterion.hasPrefix()) {
                criterion.addPrefix('o');
            }
            queryBuilder[modeFn](criterion.toSQL());
            queryBuilder.setParameter(criterion.parameter, criterion.value);
        });

        orders.forEach((order: Order) => {
            queryBuilder.addOrderBy(order.property, order.isASC() ? 'ASC' : 'DESC');
        });

        joins.forEach((join: Join) => {
            const fn = join.type + 'Join';
            queryBuilder[fn](join.path, join.name);
        });

        if (pager) {
            queryBuilder.offset(pager.offset);
            queryBuilder.limit(pager.limit);
        }

        return queryBuilder.getMany();
    }

    /**
     * Retrieve an entity by its primary key value.
     *
     * @param {number}   id
     * @param {string[]} embeds
     * @param {Join[]}   joins
     *
     * @returns {Promise<RestEntity>}
     */
    get(id: number, embeds: string[] = [], joins: Join[] = []): Promise<T> {
        return this.search([new Criterion('id', 'eq', id)], embeds, [], joins).then((rows: T[]) => {
            if (rows.length !== 1) {
                throw new NotFoundException();
            }
            return rows[0];
        });
    }

    /**
     * Save an entity in the database.
     *
     * @param {RestEntity} entity
     *
     * @returns {Promise<RestEntity>}
     */
    save(entity: T | any): Promise<T> {
        return this.repository.save(entity);
    }

    /**
     * Create an entity from plain object.
     *
     * @param {any} data
     *
     * @returns {Promise<RestEntity>}
     */
    create(data: any): Promise<T> {
        const entity: T = new this.entityClass();
        this.repository.merge(entity, data);

        // @TODO Fields validation --> send FieldValidationException
        return this.save(entity);
    }

    /**
     * Update an entity by its primary identifier.
     *
     * @param {number}   id
     * @param {any}      data
     * @param {string[]} embeds
     * @param {Join[]}   joins
     *
     * @returns {Promise<RestEntity>}
     */
    update(id: number, data: any, embeds: string[] = [], joins: Join[] = []): Promise<T> {
        return this.get(id, embeds, joins).then((entity: T) => {
            this.repository.merge(entity, data);

            // @TODO Fields validation --> send FieldValidationException
            return this.save(entity);
        });
    }

    /**
     * Delete an entity by its primary identifier.
     *
     * @param {number} id
     *
     * @returns {Promise<any>}
     */
    delete(id: number): Promise<any> {
        return this.get(id).then((entity: T) => {
            return this.repository.delete(entity.id);
        });
    }
}
