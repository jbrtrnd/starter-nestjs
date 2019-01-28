/**
 * Pager to build a search request.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default class Pager {
    /**
     * Limit.
     * @type {number}
     */
    limit: number;
    /**
     * Offset.
     * @type {number}
     */
    offset: number;

    /**
     * @param {number} page
     * @param {number} perPage
     */
    constructor(page: number, perPage: number) {
        if (page && perPage) {
            if (page <= 0) {
                page = 0;
            }

            if (perPage <= 0) {
                perPage = 25;
            }

            this.limit = perPage;
            this.offset = perPage * (page - 1);
        }
    }
}
