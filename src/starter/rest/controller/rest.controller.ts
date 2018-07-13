import { Controller, Delete, Get, HttpStatus, Post, Put, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import RestEntity from '../entity/rest.entity';
import FieldValidationException from '../exception/field-validation.exception';
import NotFoundException from '../exception/not-found.exception';
import Criterion from '../service/search/criterion';
import Join from '../service/search/join';
import Order from '../service/search/order';
import Pager from '../service/search/pager';
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
    /**
     * Entity REST service.
     *
     * @param {RestService<RestEntity>} service
     */
    protected constructor(protected service: RestService<T>) {}

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
     * Query parameters (only short aliases are valid now) :
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
     * - "join"
     * add joins to the query (will not select fields) alias used by the query builder will be the last part of the
     * join path
     * alias for : "_j"
     *
     * - "embed"
     * select more properties than the default ones
     * alias for : "_e"
     *
     * - "functions"
     * call function of entities and put the result in the "_fn" container
     * alias for : "_fn"
     *
     * - "<property-name>"
     * filter by any entity property (operator will be equal by default) (ex: field1=value)
     *
     * - "<property-name>-<operator>"
     * filter by any entity property and set the operator to apply
     *
     * By default, all entities will be retrieved, you can pass query parameters to limit or filter results
     * A custom response header named "X-REST-TOTAL" will contain the total number of rows.
     *
     * @param {Request}  request
     * @param {Response} response
     */
    @Get()
    search(@Req() request: Request, @Res() response: Response): void {
        const query = request.query;

        const rest = this.getRESTParameters(query);

        this.service
            .search(rest.criteria, rest.embeds, rest.orders, rest.joins, rest.mode, rest.pager)
            .then((rows: T[]) => {
                if (rest.pager.offset && rest.pager.limit) {
                    this.service.search(rest.criteria, [], [], rest.joins, rest.mode).then((total: T[]) => {
                        response.header('X-REST-TOTAL', total.length.toString());
                        this.mutateRows(rows, rest.functions);
                        response.json(rows);
                    });
                } else {
                    this.mutateRows(rows, rest.functions);
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
     * @param {Request}  request
     * @param {Response} response
     */
    @Get(':id')
    get(@Req() request: Request, @Res() response: Response): void {
        const params = request.params;
        const query = request.query;

        const rest = this.getRESTParameters(query);

        this.service
            .get(params.id, rest.embeds, rest.joins)
            .then((row: T) => {
                this.mutateRows([row], rest.functions);
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
     * @param {Request}  request
     * @param {Response} response
     */
    @Post()
    create(@Req() request: Request, @Res() response: Response): void {
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
     * @param {Request}  request
     * @param {Response} response
     */
    @Put(':id')
    update(@Req() request: Request, @Res() response: Response): void {
        const params = request.params;
        const body = request.body;
        const query = request.query;

        const rest = this.getRESTParameters(query);

        this.service
            .update(params.id, body, rest.embeds, rest.joins)
            .then((row: T) => {
                this.mutateRows([row], rest.functions);
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
     * @param {Request}  request
     * @param {Response} response
     */
    @Delete(':id')
    delete(@Req() request: Request, @Res() response: Response): void {
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

    /**
     * Manage request error from exception and send the response with the dedicated error code.
     *
     * @param {Error}    error
     * @param {Response} response
     */
    protected errorHandler(error: Error, response: Response): void {
        if (error instanceof FieldValidationException) {
            response.status(HttpStatus.UNPROCESSABLE_ENTITY).send(error.message);
        } else if (error instanceof NotFoundException) {
            response.status(HttpStatus.NOT_FOUND).send();
        } else {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }

    /**
     * Retrieve and convert search query parameters to understandable parameters for the rest service.
     *
     * @param query
     *
     * @returns {{pager: Pager; orders: Order[]; criteria: Criterion[]; mode: string; joins: Join[]; embeds: string[]; functions: string[]; query: string}}
     */
    protected getRESTParameters(
        query: any,
    ): {
        pager: Pager;
        orders: Order[];
        criteria: Criterion[];
        mode: string;
        joins: Join[];
        embeds: string[];
        functions: string[];
        query: string;
    } {
        const parameters = {
            pager: null,
            orders: [],
            criteria: [],
            mode: 'and',
            joins: [],
            embeds: [],
            functions: [],
            query: null,
        };

        // Custom query
        parameters.query = query._q || null;

        // Pagination
        const page = query._p;
        const number = query._pp;
        parameters.pager = new Pager(page, number);

        // Sort order
        const sortParts = query._s;
        if (sortParts) {
            sortParts.split(',').forEach(part => {
                let order = 'asc';
                let property = part;

                if (property[0] === '-') {
                    order = 'desc';
                    property = property.substr(1);
                }

                parameters.orders.push(new Order(property, order));
            });
        }

        // Filtering
        for (const column in query) {
            if (query.hasOwnProperty(column) && ['_s', '_p', '_pp', '_m', '_j', '_e', '_fn'].indexOf(column) === -1) {
                const value = query[column];
                const [property, operator] = column.split('-');

                parameters.criteria.push(new Criterion(property, operator, value));
            }
        }

        // Mode
        parameters.mode = query._m;
        if (parameters.mode !== 'and' && parameters.mode !== 'or') {
            parameters.mode = 'and';
        }

        // Joins
        const joinsParts = query._j;
        if (joinsParts) {
            joinsParts.split(',').forEach(part => {
                const [join, type] = part.split('-');
                parameters.joins.push(new Join(join, type));
            });
        }

        // Embed
        const embedParts = query._e;
        if (embedParts) {
            parameters.embeds = embedParts.split(',');
        }

        // Functions
        const functionsParts = query._fn;
        if (functionsParts) {
            parameters.functions = functionsParts.split(',');
        }

        return parameters;
    }

    /**
     * Mutate rows before send response.
     *
     * @param {RestEntity[]} rows
     * @param {string[]}     functions
     */
    protected mutateRows(rows: RestEntity[], functions: string[]): void {
        rows.forEach(row => {
            if (functions.length > 0) {
                functions.forEach(fn => {
                    this.fillFnProperty(row, fn);
                });
            }
        });
    }

    /**
     * Call a function of an entity and put the result in the _fn container.
     *
     * @param {RestEntity} row
     * @param {string}     fn
     */
    protected fillFnProperty(row: RestEntity, fn: string): void {
        if (typeof row._fn === 'undefined') {
            row._fn = {};
        }

        if (fn.indexOf('.') > -1) {
            const parts = fn.split('.');
            const property = parts[0];
            parts.shift();
            if (Array.isArray(row[property])) {
                row[property].forEach(subRow => {
                    this.fillFnProperty(subRow, parts.join('.'));
                });
            } else {
                this.fillFnProperty(row[property], parts.join('.'));
            }
        } else {
            row._fn[fn] = row[fn]();
        }
    }
}
