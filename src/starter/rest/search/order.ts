/**
 * Order to build a search request.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default class Order {
    constructor(
        public property: string,
        public order: string) {

        if (this.order !== 'asc' && this.order !== 'desc') {
            this.order = 'asc';
        }
    }

    isASC(): boolean {
        return this.order === 'asc';
    }
}
