import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

/**
 * Database module.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}
