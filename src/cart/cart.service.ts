import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../entity/cart.entity';
import { UserService } from '../user/user.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartEntity) private cartRepository: Repository<CartEntity>,
        private readonly userService: UserService,
        private readonly productService: ProductsService,
    ) {
    }

    async create(newCart: CreateCartDto) {
        const user = await this.userService.findOneById(newCart.user_uuid);
        const product = await this.productService.findOneById(newCart.product_uuid);
        return this.cartRepository.save({ ...newCart, user, product });
    }

    async findAll(userId: string) {
        return await this.cartRepository
            .createQueryBuilder('cart')
            .leftJoin('cart.user', 'user')
            .leftJoinAndSelect('cart.product', 'product')
            .where('user.uuid = :userId', { userId })
            .getMany();
    }

    async update(cartItemId: string, changes: UpdateCartDto) {
        return await this.cartRepository
            .createQueryBuilder()
            .update({ quantity: changes.quantity })
            .where('uuid = :cartItemId', { cartItemId })
            .execute();
    }

    async remove(uuid: string) {
        return await this.cartRepository.delete({ uuid });
    }
}
