import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional, Validate } from 'class-validator';
import RestEntity from '../../starter/rest/entity/rest.entity';
import Foo from './foo.entity';
import { EntityExists } from '../../starter/rest/validator/entity-exists';

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
    @IsOptional()
    @Validate(EntityExists, ['Foo'])
    foos: Foo[];

    nb(): number {
        return this.foos.length;
    }
}
