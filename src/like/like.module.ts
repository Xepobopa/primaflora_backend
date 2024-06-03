import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from '../entity/like.entity';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
    imports: [TypeOrmModule.forFeature([LikeEntity]), TokenModule, UserModule],
    controllers: [LikeController],
    providers: [LikeService],
    exports: [LikeService],
})
export class LikeModule {}
