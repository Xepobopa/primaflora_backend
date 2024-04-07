import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from '../entity/like.entity';
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';
import { TokenModule } from '../token/token.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([LikeEntity]),
        ProductsModule,
        TokenModule,
        UserModule,
    ],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule {
}
