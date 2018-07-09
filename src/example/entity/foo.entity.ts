import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import RestEntity from '../../starter/rest/entity/rest.entity';
import Bar from './bar.entity';

@Entity()
export default class Foo extends RestEntity {
    /**
     * @type {number}
     */
    @PrimaryGeneratedColumn() id: number;

    /**
     * @type {string}
     */
    @Column() name: string;

    @ManyToOne(type => Bar, bar => bar.foos)
    @JoinColumn({ name: 'bar_id' })
    bar: Bar;

    test(): string {
        return 'yolo';
    }
}
