import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { Request } from 'express';
import { CreateCommentDto } from './dto/create-comment';
import { ProductsService } from './products.service';
import { TokenService } from 'src/token/token.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ValidateLanguagePipe } from 'src/common/pipes/accept-language.pipe';
import { AcceptLanguage } from 'src/common/decorators/accept-language.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { EUserRole } from 'src/enum/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly tokenService: TokenService
    ) {}

    @Get('/getAll')
    @UsePipes(new ValidateLanguagePipe())
    findAll(@AcceptLanguage() language: string) {
        return this.productsService.getAll(language);
    }

    @Post('/create')
    @Role(EUserRole.ADMIN)
    @UseGuards(RolesGuard)
    createProduct(@Body() createProductDto: Omit<CreateProductDto, 'rating'>) {
        return this.productsService.create(createProductDto);
    }

    @Role(EUserRole.ADMIN)
    @UseGuards(RolesGuard)
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

    @Delete('/:uuid')
    @Role(EUserRole.ADMIN)
    @UseGuards(RolesGuard)
    delete(@Param('uuid') uuid: string) {
        return this.productsService.delete(uuid);
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
        return this.productsService.getOneWithComments(uuid, language, token);
    }

    @Patch('/update/:uuid')
    @UsePipes(new ValidateLanguagePipe())
    // TODO: make for admin
    @Role(EUserRole.ADMIN)
    @UseGuards(RolesGuard)
    update(
        @Param('uuid') uuid: string,
        @Body() updateProductDto: UpdateProductDto,
        @AcceptLanguage() language: string
    ) {
        return this.productsService.update(uuid, updateProductDto, language);
    } 

    private getTokenPayloadFromRequest(req: Request): any | null {
        if (!req.headers.authorization) {
            return null;
        }
        return req.headers.authorization.replace('Bearer ', '');

        // return this.tokenService.verifyToken(token, 'access');
    }
}
