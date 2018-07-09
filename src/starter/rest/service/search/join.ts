/**
 * Order to build a search request.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default class Join {
    public path: string;
    public name: string;
    public type: string;

    /**
     * @param {string} join
     * @param {string} type
     */
    constructor(join: string, type: string) {
        const parts = join.split('.');
        if (parts.length === 1) {
            this.name = join;
            this.path = 'o.' + join;
        } else {
            this.name = parts[parts.length - 1];
            this.path = join;
        }

        switch (type) {
            case 'l':
                this.type = 'left';
                break;
            case 'i':
            default:
                this.type = 'inner';
        }
    }
}
