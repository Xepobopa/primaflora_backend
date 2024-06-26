import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../entity/cart.entity';
import { ProductsService } from '../products/products.service';
import { UserService } from '../user/user.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartEntity)
        private cartRepository: Repository<CartEntity>,
        private readonly userService: UserService,
        private readonly productService: ProductsService
    ) {}

    async create(newCart: CreateCartDto) {
        const user = await this.userService.findOneById(newCart.userUId);
        const product = await this.productService.findOneByUid(
            newCart.productUId
        );
        return this.cartRepository.save({ ...newCart, user, product });
    }

    async findAll(userId: string, language: string) {
        const res = await this.cartRepository
            .createQueryBuilder('cart')
            .leftJoin('cart.user', 'user')
            .leftJoinAndSelect('cart.product', 'product')
            .leftJoin('product.translate', 'product_t')
            .addSelect(["product_t.title", "product_t.language", "product_t.shortDesc"])
            .where('user.uuid = :userId', { userId })
            .andWhere('product_t.language = :language', { language })
            .getMany();

        if (res.length === 0) {
            return [];
        }

        return res.map(cartItem => {
                const { translate, ...other } = cartItem.product;

                return {
                    ...cartItem,
                    product: {
                        ...other,
                        title: translate[0].title,
                        shortDesc: translate[0].shortDesc,
                        language: translate[0].language,
                        ...cartItem.product,
                    }
                }
            })
    }

    // async update(cartItemId: string, changes: UpdateCartDto) {
    //     return await this.cartRepository
    //         .createQueryBuilder()
    //         .update({ quantity: changes.quantity })
    //         .where('uuid = :cartItemId', { cartItemId })
    //         .execute();
    // }

    async remove(uuid: string) {
        return await this.cartRepository.delete({ uuid });
    }
}
