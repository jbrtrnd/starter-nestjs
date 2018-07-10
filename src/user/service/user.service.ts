import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import NotFoundException from '../../starter/rest/exception/not-found.exception';
import RestService from '../../starter/rest/service/rest.service';
import User from '../entity/user.entity';
import WrongCredentialsException from '../exception/wrong-credentials.exception';
import PasswordService from './security/password.service';

/**
 * User service.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
@Injectable()
export default class UserService extends RestService<User> {
    /**
     * @param {PasswordService} securityService
     * @param {Connection}      entityManager
     */
    constructor(protected securityService: PasswordService, protected entityManager: Connection) {
        super(User, entityManager);
    }

    /**
     * Save a user in the database.
     *
     * Will hash the password if it's not.
     *
     * @param entity
     *
     * @returns {Promise<User>}
     */
    save(entity: any): Promise<User> {
        if (!this.securityService.isHashed(entity.password)) {
            entity.password = this.securityService.hash(entity.password);
        }
        return super.save(entity);
    }

    /**
     * Retrieve a user by username/password combination.
     *
     * @param {string} username
     * @param {string} password
     *
     * @returns {Promise<User>}
     */
    authenticate(username: string, password: string): Promise<User> {
        return this.repository
            .findOne(
                {
                    username,
                },
                {
                    select: ['id', 'password'],
                },
            )
            .then(user => {
                if (user) {
                    if (this.securityService.compare(password, user.password)) {
                        return this.get(user.id);
                    } else {
                        throw new WrongCredentialsException();
                    }
                } else {
                    throw new NotFoundException();
                }
            });
    }
}
