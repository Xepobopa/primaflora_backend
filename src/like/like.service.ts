import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeEntity } from '../entity/like.entity';
import { UserService } from '../user/user.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(LikeEntity) private likeRepository: Repository<LikeEntity>,
        private readonly userService: UserService,
        private readonly productService: ProductsService,
    ) {
    }

    public async setLike(userUuid: string, productUuid: string) {
        const product = await this.productService.findOneById(productUuid);
        const user = await this.userService.findOneById(userUuid);
        return this.likeRepository.save({ user, product });
    }

    public async removeLike(userUuid: string, likeUuid: string) {
        // check if user own this like
        const like = await this.likeRepository.findOneOrFail({ where: { uuid: likeUuid }, relations: { user: true } });
        if (like.user.uuid !== userUuid) {
            throw new BadRequestException('Provided User doesn\'t have provided like!');
        }

        // delete like
        return this.likeRepository.remove(like);
    }

    public async getLikedProducts(userUuid: string) {
        return (await this.likeRepository
            .createQueryBuilder('like')
            .leftJoin('like.user', 'user')
            .leftJoinAndSelect('like.product', 'product')
            .where('user.uuid = :userUuid', { userUuid })
            .getMany())//.map(like => like.product)
    }
}
