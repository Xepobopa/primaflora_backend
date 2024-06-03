import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entity/product.entity';
import { Repository } from 'typeorm';
import { LikeEntity } from '../entity/like.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(LikeEntity)
        private likeRepository: Repository<LikeEntity>,
        private readonly userService: UserService
    ) {}

    public async setLike(userUuid: string, product: ProductEntity) {
        const user = await this.userService.findOneById(userUuid);
        return this.likeRepository.save({ user, product });
    }

    public async removeLike(userUuid: string, likeUuid: string) {
        try {
            // check if user own this like
            const like = await this.likeRepository.findOneOrFail({
                where: { uuid: likeUuid },
                relations: { user: true },
            });
            if (like.user.uuid !== userUuid) {
                throw new BadRequestException(
                    "Provided User doesn't have provided like!"
                );
            }

            // delete like
            return this.likeRepository.remove(like);
        } catch (e) {
            throw new BadRequestException('Cant find like entity in database');
        }
    }

    public async getLikedProducts(userUuid: string) {
        return await this.likeRepository
            .createQueryBuilder('like')
            .leftJoin('like.user', 'user')
            .leftJoinAndSelect('like.product', 'product')
            .where('user.uuid = :userUuid', { userUuid })
            .getMany(); //.map(like => like.product)
    }

    public async findOne(userId: number, productId: number) {
        return await this.likeRepository.findOne({
            where: { product: { id: productId }, user: { id: userId } },
            select: { id: true, uuid: true },
        });
    }
}
