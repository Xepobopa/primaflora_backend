import { Body, Controller, Get, Param, Post, Req, UsePipes } from '@nestjs/common';
import { Request } from 'express';
import { CreateCommentDto } from './dto/create-comment';
import { ProductsService } from './products.service';
import { TokenService } from 'src/token/token.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ValidateLanguagePipe } from 'src/common/pipes/accept-language.pipe';
import { AcceptLanguage } from 'src/common/decorators/accept-language.decorator';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly tokenService: TokenService
    ) {}

    @Post('/create')
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Post('/createComment/:productId')
    create(
        @Body() createCommentDto: CreateCommentDto,
        @Param('productId') productId: number,
        @Req() req: Request
    ) {
        const token = req.headers.authorization.replace('Bearer ', '');
        return this.productsService.createComment(
            createCommentDto,
            token,
            productId
        );
    }

    @Post('/like/:productUid')
    likeProduct(@Param('productUid') productUid: string, @Req() req: Request) {
        const token = req.headers.authorization.replace('Bearer ', '');
        return this.productsService.likeProduct(productUid, token);
    }

    @Get('/getWithComments/:uuid')
    @UsePipes(new ValidateLanguagePipe())
    getComments(
        @Param('uuid') uuid: string, 
        @Req() req: Request, 
        @AcceptLanguage() language: string
    ) {
        const token = this.getTokenPayloadFromRequest(req);
        console.log('token => ', token);
        return this.productsService.getOneWithComments(uuid, token, language);
    }

    private getTokenPayloadFromRequest(req: Request): any | null {
        if (!req.headers.authorization) {
            return null;
        }
        return req.headers.authorization.replace('Bearer ', '');

        // return this.tokenService.verifyToken(token, 'access');
    }
}
