import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { SubcategoryEntity } from './subcategory.entity';

@Entity('subcategory_t')
export class SubcategoryTranslateEntity extends AbstractEntity {
    @ManyToOne(() => SubcategoryEntity, subcategory => subcategory.translate)
    public subcategory: SubcategoryEntity;

    @Column()
    public name: string;

    @Column()
    public desc: string;

    @Column()
    public language: string;
}
