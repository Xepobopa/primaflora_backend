import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entity/comment.entity';
import { TokenModule } from 'src/token/token.module';
import { ProductEntity } from '../entity/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { LikeModule } from 'src/like/like.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductTranslateEntity } from 'src/entity/product_t.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductEntity,
            ProductTranslateEntity,
            CommentEntity,
        ]),
        CategoriesModule,
        TokenModule,
        LikeModule,
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
