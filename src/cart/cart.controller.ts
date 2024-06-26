import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../token/token.service';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ValidateLanguagePipe } from 'src/common/pipes/accept-language.pipe';
import { AcceptLanguage } from 'src/common/decorators/accept-language.decorator';

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
        private readonly tokenService: TokenService
    ) {}

    @Post()
    create(@Body() newCart: CreateCartDto) {
        return this.cartService.create(newCart);
    }

    @Get('/getAll')
    @UsePipes(new ValidateLanguagePipe())
    findAll(@Req() req: Request, @AcceptLanguage() language: string) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const userFromToken = this.tokenService.verifyToken(token, 'access');
        return this.cartService.findAll(userFromToken.uuid, language);
    }

    // @Patch('/:cartItemUuid')
    // update(
    //     @Param('cartItemUuid') cartItemId: string,
    //     @Body() updateCartDto: UpdateCartDto
    // ) {
    //     return this.cartService.update(cartItemId, updateCartDto);
    // }

    @Delete('/:uuid')
    remove(@Param('uuid') uuid: string) {
        return this.cartService.remove(uuid);
    }
}
