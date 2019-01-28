import RestService from '../../starter/rest/service/rest.service';
import Foo from '../entity/foo.entity';

export default class FooService extends RestService<Foo> {
    constructor() {
        super(Foo);
    }
}
