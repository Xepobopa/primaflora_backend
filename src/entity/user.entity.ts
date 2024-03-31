import { AbstractEntity } from './abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
    @Column('varchar', { unique: true })
    public name: string;

    @Column('varchar', { unique: true })
    public login: string;

    @Column('varchar', { unique: true, nullable: true })
    public email: string;

    @Column('varchar', { unique: true })
    public phone: string;

    @Column('boolean', { default: false })
    public is_activated: boolean;

    @Column('varchar')
    public password: string;

    @Column('boolean', { nullable: true })
    public phone_allowed: boolean;

    @Column('boolean', { nullable: true })
    public consultation_allowed: boolean;

    @OneToMany(() => CartEntity, cart => cart.user)
    public cart: CartEntity[];
}