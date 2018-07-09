import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import RestEntity from '../../starter/rest/entity/rest.entity';

/**
 * User entity.
 *
 * @author Jules Bertrand <jules.brtrnd@gmail.com>
 */
@Entity()
export default class User extends RestEntity {
    /**
     * User identifier.
     *
     * @type {number}
     */
    @PrimaryGeneratedColumn() id: number;

    /**
     * User username.
     *
     * @type {string}
     */
    @Column({ unique: true })
    username: string;

    /**
     * User password (encrypted by service).
     *
     * @type {string}
     */
    @Column({ select: false })
    password: string;
}
