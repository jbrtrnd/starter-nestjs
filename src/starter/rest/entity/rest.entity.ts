import { BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Basic starter entity, managed by all the REST system.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default abstract class RestEntity {
    /**
     * Entity primary key.
     *
     * @type {number}
     */
    @PrimaryGeneratedColumn() id: number;

    /**
     * Creation date of the entity.
     *
     * @type {Date}
     */
    @Column({ nullable: true })
    created: Date;

    /**
     * Update date of the entity.
     *
     * @type {Date}
     */
    @Column({ nullable: true })
    updated: Date | null;

    /**
     * TypeORM listener, executed before the insertion of the entity. Will set
     * the created property to the current date.
     */
    @BeforeInsert()
    beforeInsert(): void {
        this.created = new Date();
    }

    /**
     * TypeORM listener, executed before the update of the entity. Will set the
     * created property to the current date.
     */
    @BeforeUpdate()
    beforeUpdate(): void {
        this.updated = new Date();
    }

    /**
     * Convert the current object into json.
     */
    //abstract toJson(): any;
}
