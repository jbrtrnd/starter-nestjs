import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import RestEntity from '../../starter/rest/entity/rest.entity';
import Bar from './bar.entity';
import { Validate } from 'class-validator';
import { EntityExists } from '../../starter/rest/validator/entity-exists';

@Entity()
export default class Foo extends RestEntity {
    /**
     * @type {number}
     */
    @PrimaryGeneratedColumn() id: number;

    /**
     * @type {string}
     */
    @Column()
    name: string;

    @ManyToOne(type => Bar, bar => bar.foos)
    @JoinColumn({ name: 'bar_id' })
    @Validate(EntityExists, ['Bar'])
    bar: Bar;

    test(): string {
        return 'yolo';
    }
}