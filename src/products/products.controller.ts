import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateCommentDto } from './dto/create-comment';
import { ProductsService } from './products.service';
import { TokenService } from 'src/token/token.service';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly tokenService: TokenService
    ) {}

    // @Post('/create')
    // create(@Body() createProductDto: CreateProductDto) {
    //     return this.productsService.create(createProductDto);
    // }

    @Post('/createComment/:productUid')
    create(
        @Body() createCommentDto: CreateCommentDto,
        @Param('productUid') productUid: string,
        @Req() req: Request
    ) {
        const token = req.headers.authorization.replace('Bearer ', '');
        return this.productsService.createComment(
            createCommentDto,
            token,
            productUid
        );
    }

    @Post('/like/:productUid')
    likeProduct(@Param('productUid') productUid: string, @Req() req: Request) {
        const token = req.headers.authorization.replace('Bearer ', '');
        return this.productsService.likeProduct(productUid, token);
    }

    @Get('/getWithComments/:uuid')
    getComments(@Param('uuid') uuid: string, @Req() req: Request) {
        const token = req.headers.authorization.replace('Bearer ', '');
        return this.productsService.getOneWithComments(uuid, token);
    }

    private getTokenPayloadFromRequest(req: Request): any | null {
        const token = req.headers.authorization.replace('Bearer ', '');
        if (!token) {
            return null;
        }

        return this.tokenService.verifyToken(token, 'access');
    }
}
