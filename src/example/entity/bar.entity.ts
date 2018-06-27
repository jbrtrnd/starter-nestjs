import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import RestEntity from '../../starter/rest/rest.entity';

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
}
