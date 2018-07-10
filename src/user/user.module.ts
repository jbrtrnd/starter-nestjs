import { Module } from '@nestjs/common';
import { StarterModule } from '../starter/starter.module';
import AuthenticationController from './controller/authentication.controller';
import UserController from './controller/user.controller';
import PasswordService from './service/security/password.service';
import TokenService from './service/security/token.service';
import UserService from './service/user.service';

@Module({
    imports: [StarterModule],
    controllers: [AuthenticationController, UserController],
    providers: [PasswordService, TokenService, UserService],
    exports: [TokenService, UserService],
})
export class UserModule {}
