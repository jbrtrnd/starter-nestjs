import { Controller, Delete, Get, HttpStatus, Post, Put, Request, Response } from '@nestjs/common';
import RestEntity from '../entity/rest.entity';
import FieldValidationException from '../exception/field-validation.exception';
import NotFoundException from '../exception/not-found.exception';
import Criterion from '../repository/search/criterion';
import Order from '../repository/search/order';
import Pager from '../repository/search/pager';
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
    protected constructor(
        /**
         * Entity service.
         * @type { RestService }
         */
        protected service: RestService<T>,
    ) {}

    /**
     * Search in the complete list of entities.
     *
     * URL    : http(s)://host.ext/url/to/this/function
     * Method : GET
     *
     * HTTP Status code :
     * - 200 : it's ok, entities retrieved
     * - 500 : internal error
     *
     * Query parameters :
     * - "page"
     * index of the page
     * alias for : "_p"
     *
     * - "per_page"
     * number of rows per page
     * alias for : "_pp"
     *
     * - "sort"
     * sort columns, commas-separated  and prefixed by '-' for desc. order (eg : sort=-field1,field2)
     * alias for : "_s"
     *
     * - "mode"
     * perform a "and" or "or" query (default to "and")
     * alias for : "_m"
     *
     * - "<property-name>"
     * filter by any entity property (operator will be equal by default) (ex: field1=value)
     *
     * - "<property-name>-<operator>"
     * filter by any entity property and set the operator to apply
     * see doctrine expr operators
     *
     * By default, all entities will be retrieved, you can pass query parameters to limit or filter results
     * A custom response header named "X-REST-TOTAL" will contain the total number of rows.
     *
     * @param request  {Request}
     * @param response {Response}
     */
    @Get()
    search(@Request() request, @Response() response) {
        const query = request.query;

        // Pagination
        const page = query.page || query._p;
        const number = query.per_page || query._pp;
        const pager = new Pager(page, number);

        // Sort order
        const sort = query.sort || query._s;
        const orders = [];
        if (sort) {
            sort.split(',').forEach(part => {
                let order = 'asc';
                let property = part;

                if (property[0] === '-') {
                    order = 'desc';
                    property = property.substr(1);
                }

                orders.push(new Order(property, order));
            });
        }

        // Filtering
        const criteria = [];
        for (const column in query) {
            if (
                query.hasOwnProperty(column) &&
                ['sort', '_s', 'page', '_p', 'per_page', '_pp', 'mode', '_m'].indexOf(column) === -1
            ) {
                const value = query[column];
                const [property, operator] = column.split('-');

                criteria.push(new Criterion(property, operator, value));
            }
        }

        // Mode
        let mode = query.mode || query._m;
        if (mode !== 'and' && mode !== 'or') {
            mode = 'and';
        }

        this.service
            .search(criteria, orders, mode, pager)
            .then((rows: T[]) => {
                if (page && number) {
                    this.service.search(criteria, [], mode).then((total: T[]) => {
                        response.header('X-REST-TOTAL', total.length);
                        response.json(rows);
                    });
                } else {
                    response.json(rows);
                }
            })
            .catch((error: Error) => {
                this.errorHandler(error, response);
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

        this.service
            .get(params.id)
            .then((row: T) => {
                response.json(row);
            })
            .catch((error: Error) => {
                this.errorHandler(error, response);
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

        this.service
            .create(body)
            .then((row: T) => {
                response.json(row);
            })
            .catch((error: Error) => {
                this.errorHandler(error, response);
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

        this.service
            .update(params.id, body)
            .then((row: T) => {
                response.json(row);
            })
            .catch((error: Error) => {
                this.errorHandler(error, response);
            });
    }

    /**
     * Delete an entity by its primary key value.
     *
     * URL    : http(s)://host.ext/url/to/this/function/<IDENTIFIER_VALUE>
     * Method : DELETE
     *
     * HTTP Status code :
     * - 204 : it's ok, entity removed
     * - 404 : entity not found
     * - 500 : internal error
     *
     * @param request  {Request}
     * @param response {Response}
     */
    @Delete(':id')
    delete(@Request() request, @Response() response) {
        const params = request.params;

        this.service
            .delete(params.id)
            .then(() => {
                response.status(HttpStatus.NO_CONTENT);
                response.send();
            })
            .catch((error: Error) => {
                this.errorHandler(error, response);
            });
    }

    protected errorHandler(error: Error, response): void {
        if (error instanceof FieldValidationException) {
            response.status(HttpStatus.UNPROCESSABLE_ENTITY);
        } else if (error instanceof NotFoundException) {
            response.status(HttpStatus.NOT_FOUND);
        } else {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.send();
    }
}
