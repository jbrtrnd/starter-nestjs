import { Controller } from '@nestjs/common';
import RestController from '../../starter/rest/controller/rest.controller';
import User from '../entity/user.entity';
import UserService from '../service/user.service';

/**
 * User REST controller.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
@Controller('user')
export default class UserController extends RestController<User> {
    constructor(protected service: UserService) {
        super(service);
    }
}
