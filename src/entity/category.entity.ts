import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { SubcategoryEntity } from './subcategory.entity';

@Entity('category')
export class CategoryEntity extends AbstractEntity {
    @Column('varchar')
    public name: string;

    @OneToMany(() => SubcategoryEntity, subcategory => subcategory.parent)
    public childrens: SubcategoryEntity[];
}
