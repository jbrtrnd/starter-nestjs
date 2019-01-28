import RestEntity from '../entity/rest.entity.abstract';

/**
 * Basic starter REST service used to manage an entity with the database.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default abstract class RestService<T extends RestEntity> {
    protected repository;

    constructor(constructor: new() => T) {
        this.repository = constructor;
    }

    async search(): Promise<T[]> {
        return this.repository.findAll();
    }

    async get(id: number): Promise<T> {
        return this.repository.findById(id);
    }
}
