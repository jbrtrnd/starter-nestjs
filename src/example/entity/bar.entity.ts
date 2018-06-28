import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import RestEntity from '../../starter/rest/entity/rest.entity';
import Foo from './foo.entity';

@Entity()
export default class Bar extends RestEntity {
    /**
     * @type {number}
     */
    @PrimaryGeneratedColumn() id: number;

    /**
     * @type {string}
     */
    @Column() baz: string;

    @OneToMany(type => Foo, foo => foo.bar)
    foos: Foo[];
}
