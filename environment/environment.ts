module.exports = {
    production: false,
    typeorm: {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'starter_nestjs',
        entities: ['src/**/**.entity{.ts,.js}'],
        synchronize: true,
    },
    security: {
        jwt: {
            secret: 'c3rrfagXGgLqr6Zw',
            expiration: '7d',
        },
    },
};
