let environment = require('../environment/environment.ts');

if (process.env.NODE_ENV === 'production') {
    environment = require('../environment/environment.production.ts');
}

export default environment;