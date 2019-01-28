import { AutoIncrement, Column, Model, PrimaryKey } from 'sequelize-typescript';

/**
 * Basic starter REST entity, managed by all the REST module.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default abstract class RestEntity extends Model<RestEntity> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
}
