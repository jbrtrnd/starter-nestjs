import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import TokenService from '../service/security/token.service';
import UserService from '../service/user.service';

/**
 * Control if a token is valid and present in a request.
 *
 * @author  Jules Bertrand <jules.brtrnd@gmail.com>
 */
@Injectable()
export default class AuthGuard implements CanActivate {
    /**
     * @param {TokenService} tokenService
     * @param {UserService}  userService
     */
    constructor(protected tokenService: TokenService, protected userService: UserService) {}

    /**
     * @param {ExecutionContext} context
     *
     * @returns {boolean | Promise<boolean> | Observable<boolean>}
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.tokenService.retrieve(request);
        if (token) {
            try {
                const decoded = this.tokenService.verify(token);
                return this.userService
                    .get(decoded.user)
                    .then(user => {
                        return true;
                    })
                    .catch(() => {
                        return false;
                    });
            } catch (error) {
                return false;
            }
        }

        return false;
    }
}
