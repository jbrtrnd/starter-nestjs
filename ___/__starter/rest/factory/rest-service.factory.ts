import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import RestEntity from '../entity/rest.entity';
import RestService from '../service/rest.service';

/**
 * Auto create REST service linked to an entity.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
@Injectable()
export default class RestServiceFactory {
    /**
     * Keep in memory generated services.
     * @type {{}}
     */
    protected memory: any = {};

    /**
     * Entity manager.
     * @param {Connection} entityManager
     */
    constructor(protected entityManager: Connection) {}

    /**
     * Instanciate a REST service for an entity.
     *
     * @param {{new(): RestEntity}} entityClass
     *
     * @returns {RestService<RestEntity>}
     */
    createService<T extends RestEntity>(entityClass: new () => T): RestService<T> {
        const entityName = entityClass.name;
        if (typeof this.memory[entityName] === 'undefined') {
            this.memory[entityName] = new RestService<T>(entityClass, this.entityManager);
        }
        return this.memory[entityName];
    }
}
