import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'like' })
export class LikeEntity extends AbstractEntity {
    @ManyToOne(() => UserEntity, user => user.likes)
    public user: UserEntity;

    @OneToOne(() => ProductEntity)
    @JoinColumn()
    public product: ProductEntity;
}
