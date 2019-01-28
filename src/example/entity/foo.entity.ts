import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import RestEntity from '../../starter/rest/entity/rest.entity.abstract';
import Bar from './bar.entity';

@Table({
    tableName: 'foo',
})
export default class Foo extends RestEntity {
    @Column
    name: string;

    @ForeignKey(() => Bar)
    @Column
    bar_id: number;

    @BelongsTo(() => Bar)
    bar: Bar;
}
