/**
 * Criterion to build a search request.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default class Criterion {
    /**
     * Parameter identifier.
     * @type {string}
     */
    parameter: string;
    /**
     * Property to test.
     * @type {string}
     */
    property: string;
    /**
     * Operator to use.
     * @type {string}
     */
    operator: string;
    /**
     * Value to test.
     * @type {any}
     */
    value: any;

    /**
     * @param {string} property
     * @param {string} operator
     * @param {any}     value
     */
    constructor(property: string, operator: string, value: any) {
        this.property = property;
        this.operator = operator || 'eq';
        this.value = value;

        this.parameter = this.generateRandom();

        if (this.operator === 'in' || this.operator === 'notin') {
            this.value = this.value.split(',');
        }
    }

    /**
     * Generate a random string.
     *
     * @returns {string}
     */
    protected generateRandom(): string {
        return (new Date().getTime() + Math.floor(Math.random() * 10000 + 1)).toString(16);
    }

    /**
     * Return if the property has a prefix (contains a dot).
     *
     * @returns {boolean}
     */
    hasPrefix(): boolean {
        return this.property.indexOf('.') > -1;
    }

    /**
     * Add a prefix to the property.
     *
     * @param {string} prefix
     */
    addPrefix(prefix: string): void {
        this.property = prefix + '.' + this.property;
    }

    /**
     * Convert the criterion to SQL format.
     *
     * @returns {string}
     */
    toSQL(): string {
        const left = this.property;
        let right = null;
        switch (this.operator) {
            case 'eq':
                right = '= :' + this.parameter;
                break;
            case 'neq':
                right = '!= :' + this.parameter;
                break;
            case 'gt':
                right = '> :' + this.parameter;
                break;
            case 'gte':
                right = '>= :' + this.parameter;
                break;
            case 'lt':
                right = '< :' + this.parameter;
                break;
            case 'lte':
                right = '<= :' + this.parameter;
                break;
            case 'like':
                right = 'LIKE :' + this.parameter;
                break;
            case 'in':
                right = ' IN(:...' + this.parameter + ')';
                break;
            case 'notin':
                right = ' NOT IN(:...' + this.parameter + ')';
                break;
            case 'null':
                right = 'IS NULL';
                break;
            case 'notnull':
                right = 'IS NOT NULL';
                break;
        }
        return left + ' ' + right;
    }
}
