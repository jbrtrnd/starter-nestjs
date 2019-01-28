import { Controller, Get, Param } from '@nestjs/common';
import RestEntity from '../entity/rest.entity.abstract';
import RestService from '../service/rest.service';

/**
 * Basic starter REST controller.
 *
 * The controller provides basic REST actions for listing (GET), creating
 * (POST), updating (PUT) and removing (DELETE) entities.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
@Controller()
export default abstract class RestController<T extends RestEntity> {

    constructor(protected service: RestService<T>) {
    }

    @Get()
    async searchEntities(): Promise<T[]> {
        return this.service.search();
    }

    @Get(':id')
    async getEntity(@Param() params): Promise<T> {
        return this.service.get(params.id);
    }
}
