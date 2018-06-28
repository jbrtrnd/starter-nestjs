import { Connection } from 'typeorm';
import RestEntity from '../entity/rest.entity';
import NotFoundException from '../exception/not-found.exception';
import RestRepository from '../repository/rest.repository';
import Criterion from '../repository/search/criterion';
import Order from '../repository/search/order';
import Pager from '../repository/search/pager';

/**
 * Basic starter REST service used to manage an entity with the database.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default class RestService<T extends RestEntity> {
    /**
     * Entity repository.
     * @type { Repository }
     */
    protected repository: RestRepository<T>;

    constructor(
        /**
         * Entity class.
         * @type { RestEntity }
         */
        protected entityClass: new () => T,
        /**
         * Repository class.
         * @type { RestRepository }
         */
        protected repositoryClass: new () => RestRepository<T>,
        /**
         * Entity manager.
         * @type { Connection }
         */
        protected entityManager: Connection,
    ) {
        this.repository = this.entityManager.getCustomRepository(repositoryClass);
    }

    search(
        criteria: Criterion[] = [],
        orders: Order[] = [],
        mode: 'and' | 'or' = 'and',
        pager: Pager = null,
    ): Promise<T[]> {
        return this.repository.search(criteria, orders, mode, pager);
    }

    /**
     * Retrieve an entity by its primary key value.
     *
     * @param id {number}
     * @returns {Promise<RestEntity>}
     */
    get(id: number): Promise<T> {
        return this.repository.findOne(id).then((row: T) => {
            if (!row) {
                throw new NotFoundException();
            }
            return row;
        });
    }

    /**
     * Save an entity in the database.
     *
     * @param entity {RestEntity}
     * @returns {Promise<RestEntity>}
     */
    save(entity: T | any): Promise<T> {
        return this.repository.save(entity);
    }

    /**
     * Create an entity from plain object.
     *
     * @param data {any}
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
     * @param id   {number}
     * @param data {any}
     * @returns {Promise<RestEntity>}
     */
    update(id: number, data: any): Promise<T> {
        return this.get(id).then((entity: T) => {
            this.repository.merge(entity, data);

            // @TODO Fields validation --> send FieldValidationException
            return this.save(entity);
        });
    }

    /**
     * Delete an entity by its primary identifier.
     *
     * @param id   {number}
     * @returns {Promise<any>}
     */
    delete(id: number): Promise<any> {
        return this.get(id).then((entity: T) => {
            return this.repository.delete(entity.id);
        });
    }
}
