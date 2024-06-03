import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entity/comment.entity';
import { TokenModule } from 'src/token/token.module';
import { ProductEntity } from '../entity/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { LikeModule } from 'src/like/like.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductEntity]),
        TypeOrmModule.forFeature([CommentEntity]),
        TokenModule,
        LikeModule,
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
