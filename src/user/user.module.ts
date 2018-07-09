import { Module } from '@nestjs/common';
import { StarterModule } from '../starter/starter.module';
import AuthenticationController from './controller/authentication.controller';
import UserController from './controller/user.controller';
import SecurityService from './service/security.service';
import UserService from './service/user.service';

@Module({
    imports: [StarterModule],
    controllers: [UserController, AuthenticationController],
    providers: [SecurityService, UserService],
})
export class UserModule {}
