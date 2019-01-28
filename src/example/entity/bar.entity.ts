import { Column, HasMany, Table } from 'sequelize-typescript';
import RestEntity from '../../starter/rest/entity/rest.entity.abstract';
import Foo from './foo.entity';

@Table({
    tableName: 'bar',
})
export default class Bar extends RestEntity {
    @Column
    name: string;

    @HasMany(() => Foo)
    foos: Foo[];
}
