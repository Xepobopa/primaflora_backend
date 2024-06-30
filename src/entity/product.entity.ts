import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { SubcategoryEntity } from './subcategory.entity';
import { CommentEntity } from './comment.entity';
import { ProductTranslateEntity } from './product_t.entity';
import { CartEntity } from './cart.entity';

@Entity('product')
export class ProductEntity extends AbstractEntity {
    @Column('varchar')
    public photo_url: string;

    @OneToMany(() => ProductTranslateEntity, translate => translate.product, { onDelete: 'CASCADE' })
    public translate: ProductTranslateEntity[];

    @Column('int')
    public price_currency: number;

    @Column('int', { nullable: true })
    public price_points: number;

    @Column('int', { nullable: true })
    public percent_discount: number;

    @Column('int')
    public rating: number;

    @ManyToOne(() => SubcategoryEntity, subcategory => subcategory.products)
    public category: SubcategoryEntity;

    @OneToMany(() => CommentEntity, comment => comment.product, { onDelete: 'CASCADE' })
    public comments: CommentEntity[];

    @OneToMany(() => CartEntity, cart => cart.product, { onDelete: 'CASCADE' })
    public carts: CartEntity[];
}
