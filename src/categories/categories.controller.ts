import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {
    }

    @Post('/create')
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get('/getAll')
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get('/:categoryName')
    public async findCategory(@Param('categoryName') categoryName: string) {
        return this.categoriesService.findByCategoryName(categoryName);
    }

    @Get('/getProducts/:categoryName')
    public async findProductsByCategory(@Param('categoryName') categoryName: string) {
        return this.categoriesService.findProductsByCategoryName(categoryName);
    }
}
