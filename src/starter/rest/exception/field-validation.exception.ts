/**
 * REST field validation error.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default class FieldValidationException extends Error {
    readonly message: any;

    constructor(message?: string | object) {
        super();
        this.message = message;
    }
}
