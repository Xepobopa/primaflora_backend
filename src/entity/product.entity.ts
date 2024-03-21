import { AbstractEntity } from './abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity('product')
export class ProductEntity extends AbstractEntity {
    @Column('varchar')
    public photo_url: string;

    @Column('varchar')
    public title: string;

    @Column('varchar')
    public desc: string;

    @Column('int')
    public price_currency: number;

    @Column('int', { nullable: true })
    public price_points: number;

    @Column('int', { nullable: true })
    public percent_discount: number;

    @Column('int')
    public rating: number;

    @ManyToOne(() => CategoryEntity, category => category.products)
    public category: CategoryEntity;
}