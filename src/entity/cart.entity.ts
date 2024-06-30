import { AbstractEntity } from './abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

@Entity('cart')
export class CartEntity extends AbstractEntity {
    @ManyToOne(() => UserEntity, user => user.cart)
    public user: UserEntity;

    @Column()
    public quantity: number;

    @ManyToOne(() => ProductEntity, product => product.carts)
    @JoinColumn({ name: 'product_id' })
    public product: ProductEntity;
}