# NestJS project starter

A project starter written with NestJS and TypeORM.

The first goal of the starter is to write a strong REST API in a few minutes.

# Table of content
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installing dependencies](#installing-dependencies)
    * [Run](#run)
* [Overview](#overview)
    * [Base project structure](#base-project-structure)
    * [Project configuration](#project-configuration)
        * [TypeORM configuration](#typeorm-configuration)
    * [REST architecture](#rest-architecture)
* [Create your own module](#create-your-own-module)
    * [What is a Module ?](#what-is-a-module-)
    * [Module skeleton](#module-skeleton)
    * [The Module class](#the-module-class)
    * [Controllers and Routes](#controllers-and-routes)
    * [Middlewares](#middlewares)
    * [Doctrine entities](#doctrine-entities)
    * [Console commands](#console-commands)
* [Create your own REST api](#create-your-own-rest-api)
    * [Entity serializing](#entity-serializing)
    * [Entity field validation](#entity-field-validation)
    * [Query relationships](#query-relationships)
* [Code generator](#code-generator)
* [Automated Grunt tasks](#automated-grunt-tasks)
    * [Checking code style](#checking-code-style)
    * [Running tests](#running-tests)
    * [Generate API documentation](#generate-api-documentation)
    * [Running built-in PHP development server](#running-built-in-php-development-server)
    * [Aliases](#aliases)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 
Go to deployment section for notes on how to deploy the project on a live system.

This project starter is using [NPM](https://www.npmjs.com/) to manage integration tasks as checking code-style, running tests ... 

It also contains an example module to show you how to build your custom module. You should delete it if you want to use this starter for a projet.

### Prerequisites

* [Node.js](https://nodejs.org/) 

    Core runtime of the starter.

* [npm](https://www.npmjs.com/get-npm) 

    Needed to install JavaScript dependencies and launch some automated tasks.

### Installing dependencies

At the root directory of the starter, run the following command :

```shell
npm install
```

### Run

At the root directory of the starter, run one of the following command :

```shell
npm run start
```
To launch the starter in development mode.

```shell
npm run start:dev
```
To launch the starter in development mode with autoreload (provided by nodemon).

```shell
npm run start:prod
```
To compile and launch the starter in production mode.

## Overview

### Base project structure

```
|-- dist/                        --> Compiled JavaScript files root directory
|-- environment/                 --> Compiled JavaScript files root directory
    |-- envronment.production.ts --> Configuration file for production mode
    |-- environment.ts           --> Configuration file for development mode
|-- node_modules/                --> Javascript dependencies installed from NPM
|-- src/                         --> Sources files root directory
    |-- starter                  --> Starter internal module, do not delete this directory !
    |-- example                  --> An example of custom module
    |-- bootstrap.module.ts      --> Bootstrap module
    |-- environment.ts           --> Environment loader
    |-- main.hmr.ts              --> Application entry point (HMR mode)
    |-- main.ts                  --> Application entry point
|-- .gitignore
|-- .prettierrc                  --> Prettier configuration (development)
|-- nodemon.json                 --> Nodemon configuration (development)
|-- package.json
|-- package-lock.json
|-- tsconfig.json                --> TypeScript configuration
|-- tslint.json                  --> TSLint configuration
|-- webpack.config.js            --> Webpack configuration
```

## Project configuration

The starter allow you to define global configuration files depending on the environment mode youre running (development or production). 
The configuration files are JavaScript modules exporting a configuration object. They should resides in 
the ``environment`` directory.

By default, there are a ``envronment.production.ts`` and a ``environment.ts`` used by the starter to provide different
configuration based on the environment.

The configuration will be accessible by importing the ``src/environment.ts`` JavaScript module.

Example :
```typescript
import environment from '../../../environment';

if (environment.production) {
    console.log('Running production mode');
}

console.log(environment.randomProperty);
```

You can modify the ``src/environment.ts`` to manage multiple configuration.
By default, the production configuration file will be loaded if the global variable ``NODE_ENV`` is set to ``production``,
elsewhere the development configuration file will be loaded.

This management is heavily inspired by Angular.

#### TypeORM configuration

```typescript
module.exports = {
    production: false,
    typeorm: {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'username',
        password: 'my_password',
        database: 'my_databse',
        entities: ['src/**/**.entity{.ts,.js}'],
        synchronize: true,
    },
};
```

You can configure the TypeORM configuration by editing the key ``typeorm`` of your configuration file. Take a look at 
TypeORM docs to see what you can do.

The starter is pre-configured to use PostgreSQL but can also work with others Database systems (depending of TypeORM support).

### REST architecture

This starter provide some classes allowing you to create a rapid JSON REST api. The REST architecture that you'll be able
to build is strongly linked to TypeORM.

See [Create your own REST api](#create-your-own-rest-api) section to create your own REST api but read this chapter first.

When creating an entity, a controller and some routes linked to this controller functions, you can inherit some Starter 
classes that will allow you to simply build a REST api for this entity :

* ``starter/rest/entity/rest.entity.ts``
* ``starter/rest/controller/rest.controller.ts``
* ``starter/rest/service/rest.service.ts``

The ``RestController`` is designed to receive GET, PUT, POST and DELETE http requests and will send back to you some JSON response
with an HTTP status code representing the final state of your request. It will needs a link to the entity class of your 
``RestEntity``.

A ``RestController`` correctly mapped to its routes will produce the following api :

* **Search in the complete list of entities**

    ``GET : https://my.url.ext/some/route``
    
    Should be mapped to the ``search`` RestController action
    
    Response codes :
    * ``200`` : it's ok, entities retrieved
    * ``500`` : internal error
    
    Return an array of serialized entities on success.
    
    Query parameters :
    * ``_p`` (page) : index of the page 
    * ``_pp`` (per_page) : number of rows per page 
    * ``_s`` (sort) : sort columns, commas-separated  and prefixed by '-' for desc. order (eg : ``sort=-field1,field2``) 
    * ``_j`` (joins) : 
    * ``_e`` (embed) : 
    * ``_fn`` (functions) :
    * ``_m`` (mode) : perform a "and" or "or" query (default to "and") 
    * ``<property-name>`` : filter by any entity property (operator will be equal by default) (eg: ``field1=value``)
    * ``<property-name>-<operator>`` : filter by any entity property and set the operator to apply
    
    By default, all entities will be retrieved, you can pass query parameters to limit or filter results :
    A custom response header named "X-REST-TOTAL" will contain the total number of rows.

* **Retrieve an entity by its primary key value**
    
    ``GET : https://my.url.ext/some/route/:id``

    The ``:id`` route param must be always set.
    
    Should be mapped to the ``get`` RestController action.
    
    Response codes :
    * ``200`` : it's ok, entity retrieved
    * ``404`` : entity not found
    * ``500`` : internal error
    
    Query parameters :
    * ``_e`` (embed) :
    * ``_j`` (joins) :
    * ``_fn`` (functions) :
            
    Return the retrieved entity on success.

* **Create an entity**

    ``POST : https://my.url.ext/some/route``

    Request body with ``Content-type : application/json`` header:
    ``` 
    {
        "field_1": <FIELD1_VALUE>,
        "field_2": <FIELD2_VALUE>,
        ...
    }
    ```

    Should be mapped to the ``create`` RestController action
    
    Response codes :
    * ``200`` : it's ok, entity created
    * ``422`` : fields validation failed
    * ``500`` : internal error
    
    Query parameters :
   
   
    Return the created serialized entity on success or the fields validation errors.
   

* **Update an entity by its primary key value**

    ``PUT : https://my.url.ext/some/route/:id``
    
    Request body with ``Content-type : application/json`` header:
    ``` 
    {
        "field_1": <FIELD1_VALUE>,
        "field_2": <FIELD2_VALUE>,
        ...
    }
    ```
    
    The ``:id`` route param must be always set.

    Should be mapped to the ``update`` RestController action
    
    Response codes :
    * ``200`` : it's ok, entity updated
    * ``404`` : entity not found
    * ``422`` : fields validation failed
    * ``500`` : internal error
    
    Query parameters :
    * ``_e`` (embed) :
    * ``_j`` (joins) :
    * ``_fn`` (functions) :
    
    You can partially update the entity.
    
    Return the updated serialized entity on success or the fields validation errors.

* **Remove an entity by its primary key value**

    ``DELETE : https://my.url.ext/some/route/:id``
    
    The ``:id`` route param must be always set.

    Should be mapped to the ``delete`` RestController action
    
    Response codes :
    * ``204`` : it's ok, entity removed
    * ``404`` : entity not found
    * ``500`` : internal error

    Return an empty response.