///<reference path="../../../node_modules/typeorm/repository/Repository.d.ts"/>
import {
    Controller,
    Delete,
    Get,
    HttpStatus,
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
        this.repository = this.entityManager.getRepository<T>(entityClass);
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
     * - 500 : internal error
     *
     * @param request  {Request}
     * @param response {Response}
     */
    @Get(':id')
    get(@Request() request, @Response() response) {
        const params = request.params;

        this.repository
            .findOne(params.id)
            .then((row: T) => {
                if (!row) {
                    response.status(HttpStatus.NOT_FOUND);
                }
                response.json(row);
            })
            .catch(() => {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR);
                response.send();
            });
    }

    /**
     * Create an entity.
     *
     * URL    : http(s)://host.ext/url/to/this/function
     * Method : POST
     * Body   :
     * {
     *     field_1: <FIELD1_VALUE>,
     *     field_2: <FIELD2_VALUE>,
     *     ...
     * }
     *
     * HTTP Status code :
     * - 200 : it's ok, entity created
     * - 422 : fields validation failed
     * - 500 : internal error
     *
     * @param request  {Request}
     * @param response {Response}
     */
    @Post()
    create(@Request() request, @Response() response): void {
        const body = request.body;
        const row = new this.entityClass();

        this.repository.merge(row, body);

        // @TODO Fields validation --> if error --> send 422

        this.repository
            .save(row)
            .then((res: T) => {
                response.json(res);
            })
            .catch(() => {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR);
                response.send();
            });
    }

    /**
     * Update an entity by its primary identifier
     *
     * URL    : http(s)://host.ext/url/to/this/function/<IDENTIFIER_VALUE>
     * Method : PUT
     * Body   :
     * {
     *     field_1: <FIELD1_VALUE>,
     *     field_2: <FIELD2_VALUE>,
     *     ...
     * }
     *
     * HTTP Status code :
     * - 200 : it's ok, entity updated
     * - 404 : entity not found
     * - 422 : fields validation failed
     * - 500 : internal error
     *
     * @param request  {Request}
     * @param response {Response}
     */
    @Put(':id')
    update(@Request() request, @Response() response) {
        const params = request.params;
        const body = request.body;

        this.repository.findOne(params.id).then(row => {
            if (!row) {
                response.status(HttpStatus.NOT_FOUND);
                response.send();
            } else {
                // @TODO Fields validation --> if error --> send 422

                this.repository.merge(row, body);
                this.repository
                    .save(row)
                    .then((res: T) => {
                        response.json(res);
                    })
                    .catch(() => {
                        response.status(HttpStatus.INTERNAL_SERVER_ERROR);
                        response.send();
                    });
            }
        });
    }

    @Delete(':id')
    delete(@Request() request, @Response() response) {
        const params = request.params;

        this.repository.findOne(params.id).then(row => {
            if (!row) {
                response.status(HttpStatus.NOT_FOUND);
                response.send();
            } else {
                this.repository
                    .delete(row.id)
                    .then(() => {
                        response.json();
                    })
                    .catch(() => {
                        response.status(HttpStatus.INTERNAL_SERVER_ERROR);
                        response.send();
                    });
            }
        });
    }
}
