import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { SubcategoryEntity } from 'src/entity/subcategory.entity';
import { LikeModule } from 'src/like/like.module';
import { TokenModule } from 'src/token/token.module';
import { SubcategoryTranslateEntity } from 'src/entity/subcategory_t.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CategoryEntity,
            SubcategoryEntity,
            SubcategoryTranslateEntity,
        ]),
        LikeModule,
        TokenModule,
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule {}
