import { Controller, Get, Param, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Request } from 'express';

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
        const token = req.headers.authorization.replace('Bearer ', '');
        return await this.categoriesService.findSubcategoryWithProducts(
            subcategoryId,
            token
        );
    }
}
