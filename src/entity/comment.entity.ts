import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

@Entity('comment')
export class CommentEntity extends AbstractEntity {
    @ManyToOne(() => UserEntity, user => user.id)
    user: UserEntity;

    @ManyToOne(() => ProductEntity, product => product.comments)
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;

    @Column()
    text: string;

    @Column({ nullable: false })
    rating: number;
}
