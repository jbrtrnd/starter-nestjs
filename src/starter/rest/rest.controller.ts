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
import RestRepository from './rest.repository';
import Criterion from './search/criterion';
import Order from './search/order';
import Pager from './search/pager';

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
    protected repository: RestRepository<T>;

    protected constructor(
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

    @Get()
    search(@Request() request, @Response() response) {
        const query = request.query;

        // Pagination
        const page   = query.page || query._p;
        const number = query.per_page || query._pp;
        const pager  = new Pager(page, number);

        // Sort order
        const sort   = query.sort || query._s;
        const orders = [];
        if (sort) {
            sort.split(',').forEach((part) => {
                let order = 'asc';
                let property = part;

                if (property[0] === '-') {
                    order = 'desc';
                    property = property.substr( 1);
                }

                orders.push(new Order(
                    property,
                    order,
                ));
            });
        }

        // Filtering
        const criteria = [];
        for (const column in query) {
            if (query.hasOwnProperty(column) && ['sort', '_s', 'page', '_p', 'per_page', '_pp', 'mode', '_m'].indexOf(column) === -1) {
                const value = query[column];
                const [property, operator] = column.split('-');

                criteria.push(new Criterion(
                    property,
                    operator,
                    value,
                ));
            }
        }

        // Mode
        let mode = query.mode || query._m;
        if (mode !== 'and' && mode !== 'or') {
            mode = 'and';
        }

        this.repository.search(criteria, orders, mode, pager).then((rows: T[]) => {
            if (page && number) {
                this.repository.search(criteria, [], mode).then((total: T[]) => {
                    response.header('X-REST-TOTAL', total.length);
                    response.json(rows);
                });
            } else {
                response.json(rows);
            }
        }).catch(() => {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            response.send();
        });
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
        // NOTE : row is defined as "any" to avoid type check error caused by TS
        const row: any = new this.entityClass();

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

        // NOTE : row is defined as "any" to avoid type check error caused by TS
        this.repository.findOne(params.id).then((row: any) => {
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

        this.repository.findOne(params.id).then((row: T) => {
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
