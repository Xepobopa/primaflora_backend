import { AbstractEntity } from './abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('category')
export class CategoryEntity extends AbstractEntity {
    @Column('varchar')
    public name: string;

    @ManyToOne(() => CategoryEntity, parent => parent.id, { nullable: true })
    public parent: CategoryEntity;

    @OneToMany(() => ProductEntity, product => product.category)
    public products: ProductEntity[];
}