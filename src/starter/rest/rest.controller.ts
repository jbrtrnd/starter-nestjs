import {
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Request,
    Response,
} from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import RestEntity from './rest.entity';

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
    /**
     * Entity repository.
     * @type { Repository }
     */
    protected repository: Repository<T>;

    protected constructor(
        /**
         * Entity class.
         * @type { RestEntity }
         */
        protected entityClass: new () => T,
        /**
         * Entity manager.
         * @type { Connection }
         */
        protected entityManager: Connection,
    ) {
        this.repository = this.entityManager.getRepository(entityClass);
    }

    @Get()
    search() {
        return this.repository.find();
    }

    /**
     * Retrieve an entity by its primary key value.
     *
     * URL    : http(s)://host.ext/url/to/this/function/<IDENTIFIER_VALUE>
     * Method : GET
     *
     * HTTP Status code :
     * - 200 : it's ok, entity retrieved
     * - 404 : entity not found
     *
     * @param request {Request}
     * @param response {Response}
     */
    @Get(':id')
    get(@Request() request, @Response() response) {
        const params = request.params;
        this.repository.findOne(params.id).then(row => {
            if (!row) {
                response.status(HttpStatus.NOT_FOUND);
            }
            response.json(row);
        });
    }

    @Post()
    create(@Request() request, @Response() response) {
        return 'CREATE';
    }

    @Put(':id')
    update(@Param() params) {
        return 'UPDATE ' + params.id;
    }

    @Delete(':id')
    delete(@Param() params) {
        return 'DELETE ' + params.id;
    }
}
