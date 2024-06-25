import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ProductEntity } from './product.entity';

@Entity('product_t')
export class ProductTranslateEntity extends AbstractEntity {
    @ManyToOne(() => ProductEntity, product => product.translate)
    public product: ProductEntity;

    @Column('varchar')
    public title: string;

    @Column('simple-json')
    public desc: string;

    @Column()
    public language: string;
}
