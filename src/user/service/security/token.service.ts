import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import environment from '../../../environment';
import JwtExpiredException from '../../exception/jwt-expired.exception';
import JwtInvalidException from '../../exception/jwt-invalid.exception';

/**
 * Service responsible to manage JWT tokens.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
@Injectable()
export default class TokenService {
    /**
     * Generate a JWT.
     *
     * @param data
     *
     * @returns {string}
     */
    sign(data: any): string {
        return jwt.sign(data, environment.security.jwt.secret, {
            expiresIn: environment.security.jwt.expiration,
        });
    }

    /**
     * Decode and verify a JWT.
     *
     * @param {string} token
     *
     * @returns {any}
     */
    verify(token: string): any {
        try {
            return jwt.verify(token, environment.security.jwt.secret);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new JwtExpiredException();
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new JwtInvalidException();
            }
        }
    }

    /**
     * Retrieve a =JWT from an HTTP request.
     *
     * @param request
     *
     * @returns {string}
     */
    retrieve(request: any): string {
        const authorization = request.headers.authorization;
        if (authorization) {
            return authorization.replace('Bearer : ', '');
        }
    }
}
