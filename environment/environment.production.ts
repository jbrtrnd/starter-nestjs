module.exports = {
    production: true,
    typeorm: {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'starter_nestjs',
        entities: ['dist/**/**.entity{.ts,.js}'],
        synchronize: false,
    },
    security: {
        jwt: {
            secret: 'ujrXKRv7q7sS3hFu',
            expiration: '7d',
        },
    },
};
