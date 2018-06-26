import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';

/**
 * Basic starter entity, managed by all the REST system.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
export default abstract class RestEntity {
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
    protected beforeInsert(): void {
        this.created = new Date();
    }

    /**
     * TypeORM listener, executed before the update of the entity. Will set the
     * created property to the current date.
     */
    @BeforeUpdate()
    protected beforeUpdate(): void {
        this.updated = new Date();
    }
}
