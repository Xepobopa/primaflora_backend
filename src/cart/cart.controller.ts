import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Request } from 'express';
import { TokenService } from '../token/token.service';

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
        private readonly tokenService: TokenService,
    ) {}

    @Post()
    create(@Body() newCart: CreateCartDto) {
        return this.cartService.create(newCart);
    }

    @Get('/getAll/:userId')
    findAll(@Param('userId') userId: string) {
        // if access token provided
        // const token = req.headers.authorization.replace('Bearer ', '');
        // const userFromToken = this.tokenService.verifyToken(token, 'access');
        return this.cartService.findAll(userId);
    }

    @Patch('/:cartItemUuid')
    update(
        @Param('cartItemUuid') cartItemId: string,
        @Body() updateCartDto: UpdateCartDto,
    ) {
        return this.cartService.update(cartItemId, updateCartDto);
    }

    @Delete(':uuid')
    remove(@Param('uuid') id: string) {
        return this.cartService.remove(id);
    }
}
