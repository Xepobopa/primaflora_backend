import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { TokenModule } from '../token/token.module';
import { VerificationEntity } from 'src/entity/verification.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([VerificationEntity]),
        TypeOrmModule.forFeature([UserEntity]),
        TokenModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
