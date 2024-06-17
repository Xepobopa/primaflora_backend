import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from './product.entity';
import { SubcategoryTranslateEntity } from './subcategory_t.entity';

@Entity('subcategory')
export class SubcategoryEntity extends AbstractEntity {
    @Column()
    image: string;

    @OneToMany(
        () => SubcategoryTranslateEntity,
        translate => translate.subcategory
    )
    translate: SubcategoryTranslateEntity[];

    @ManyToOne(() => CategoryEntity, category => category.childrens)
    parent: CategoryEntity;

    @OneToMany(() => ProductEntity, product => product.category)
    products: ProductEntity[];
}
