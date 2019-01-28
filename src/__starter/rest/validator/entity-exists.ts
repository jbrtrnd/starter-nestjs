import { ValidationArguments, ValidatorConstraint } from 'class-validator';
import { Injectable } from '@nestjs/common';
import RestServiceFactory from '../factory/rest-service.factory';
import Criterion from '../service/search/criterion';

@ValidatorConstraint({ async: true })
@Injectable()
export class EntityExists {
    constructor(protected factory: RestServiceFactory) {}

    async validate(value: number | any[], validationArguments: ValidationArguments) {
        let ret = false;

        const entity = validationArguments.constraints[0] || null;

        if (!entity) {
            return ret;
        }

        const service = this.factory.createService(entity);

        try {
            if (value instanceof Array) {
                let ids = [];

                for (const object of value) {
                    if (ids.indexOf(object.id) !== -1) {
                        continue;
                    }

                    ids = [...ids, object.id];
                }

                const res = await service.search([new Criterion('id', 'in', ids)]);

                if (res.length === ids.length) {
                    ret = true;
                }
            } else {
                await service.get(value);
                ret = true;
            }
        } catch (e) {}

        return ret;
    }

    defaultMessage(validationArguments: ValidationArguments) {
        let entity = validationArguments.constraints[0] || 'entity';

        if (entity !== 'entity') {
            entity = entity.charAt(0).toLowerCase() + entity.slice(1);
        }

        return `${entity} doesn't exist`;
    }
}
