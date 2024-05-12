import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'verification' })
export class VerificationEntity extends AbstractEntity {
    @Column()
    public code: string;

    @JoinColumn({ name: 'user_id' })
    @OneToOne(() => UserEntity, user => user.id)
    public user: UserEntity;

    @Column({ type: 'timestamptz' })
    public exp: Date;
}
