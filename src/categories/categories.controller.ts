import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CategoriesService } from './categories.service';
import { SubcategoryDto } from './dto/subcategory.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get('findAllWithSub')
    public async findAllWithSub() {
        return await this.categoriesService.findAllWithSub();
    }

    // return subcategories with products. Products have minimal fields to be shown (not description and comments)
    @Get('/findSubcategoryWithProducts/:subcategoryId')
    public async findSubcategoryWithProducts(
        @Param('subcategoryId') subcategoryId: number,
        @Req() req: Request
    ) {
        let token = null;
        if (req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        }

        return await this.categoriesService.findSubcategoryWithProducts(
            subcategoryId,
            token
        );
    }

    @Post('/subcategory/create')
    public async createSubategory(@Body() subcategoryDto: SubcategoryDto) {
        return await this.categoriesService.createSubcategory(subcategoryDto);
    }
}
