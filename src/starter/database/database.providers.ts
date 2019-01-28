import { Sequelize } from 'sequelize-typescript';
import environment from '../../environment';

/**
 * Database providers.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export const databaseProviders = [
    {
        provide: 'SequelizeToken',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: environment.database.type,
                host: environment.database.host,
                port: environment.database.port,
                username: environment.database.username,
                password: environment.database.password,
                database: environment.database.database,
                modelPaths: [
                    __dirname + '/../../**/*.entity.ts',
                ],
                define: {
                    timestamps: true,
                },
            });

            await sequelize.sync({ alter: true });

            return sequelize;
        },
    },
];
