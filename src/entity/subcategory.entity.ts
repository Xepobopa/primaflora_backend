import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from './product.entity';

@Entity('subcategory')
export class SubcategoryEntity extends AbstractEntity {
    @Column()
    image: string;

    @Column()
    name: string;

    @Column()
    desc: string;

    @ManyToOne(() => CategoryEntity, category => category.childrens)
    parent: CategoryEntity;

    @OneToMany(() => ProductEntity, product => product.category)
    products: ProductEntity[];
}
