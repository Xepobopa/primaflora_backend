import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { CartEntity } from './cart.entity';
import { LikeEntity } from './like.entity';
import { RoleEntity } from './role.entity';

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

    @Column()
    public invitationCode: string;

    @Column('boolean', { nullable: true })
    public phone_allowed: boolean;

    @OneToOne(() => UserEntity, user => user.invitedBy, {
        nullable: true,
        cascade: ['insert', 'update'],
    })
    @JoinColumn() // This should be on the side that owns the relationship
    public invitedUser?: UserEntity;

    @OneToOne(() => UserEntity, user => user.invitedUser)
    public invitedBy?: UserEntity;

    @Column('boolean', { nullable: true })
    public consultation_allowed: boolean;

    @OneToMany(() => CartEntity, cart => cart.user)
    public cart: CartEntity[];

    @OneToMany(() => LikeEntity, like => like.user)
    public likes: LikeEntity[];

    @ManyToOne(() => RoleEntity)
    @JoinColumn({ name: 'role_id' })
    public role: RoleEntity;
}
