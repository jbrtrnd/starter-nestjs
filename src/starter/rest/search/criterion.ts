/**
 * Criterion to build a search request.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default class Criterion {
    parameter: string;
    property: string;
    operator: string;
    value: any;

    constructor(property: string, operator: string, value: any) {
        this.property = property;
        this.operator = operator || 'eq';
        this.value    = value;

        this.parameter = this.generateParameter();

        if (this.operator === 'in' || this.operator === 'notin') {
            this.value = this.value.split(',');
        }
    }

    protected generateParameter(): string {
        return (new Date().getTime() + Math.floor((Math.random() * 10000) + 1)).toString(16);
    }

    toSQL(): string {
        const left = this.property;
        let right  = null;
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
