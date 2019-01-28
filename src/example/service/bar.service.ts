import RestService from '../../starter/rest/service/rest.service';
import Bar from '../entity/bar.entity';

export default class BarService extends RestService<Bar> {
    constructor() {
        super(Bar);
    }
}
