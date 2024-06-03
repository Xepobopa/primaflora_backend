import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { SubcategoryEntity } from './subcategory.entity';
import { CommentEntity } from './comment.entity';

@Entity('product')
export class ProductEntity extends AbstractEntity {
    @Column('varchar')
    public photo_url: string;

    @Column('varchar')
    public title: string;

    @Column('simple-json')
    public desc: string;

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

    @OneToMany(() => CommentEntity, comment => comment.product)
    public comments: CommentEntity[];
}
