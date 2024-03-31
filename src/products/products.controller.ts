import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {
    }

    @Post('/create')
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get('/getAll')
    findAllByQuery(@Query() query: ProductQueryDto) {
        return this.productsService.findAllByQuery(query);
    }

    @Get('/get/:id')
    findOneById(@Param('id') id: string) {
        return this.productsService.findOneById(id);
    }
}
