// import { Column, Entity, ManyToOne } from 'typeorm';
// import { AbstractEntity } from './abstract.entity';
// import { ELanguages } from './types';
// import { CategoryEntity } from './category.entity';

// @Entity('category_t')
// export class CategoryTranslateEntity extends AbstractEntity {
//     @ManyToOne(() => CategoryEntity, category => category.translate)
//     public category: CategoryEntity;

//     @Column('varchar')
//     public name: string;

//     @Column({ type: 'enum', enum: ELanguages })
//     public language: ELanguages;
// }
