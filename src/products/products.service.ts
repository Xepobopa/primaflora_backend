import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entity/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        private readonly categoryService: CategoriesService,
    ) {
    }

    public async create(createProductDto: CreateProductDto) {
        const category = await this.categoryService.findOneById(createProductDto.categoryId);
        return this.productRepository.save({ ...createProductDto, category });
    }

    public async findAllByQuery(query: ProductQueryDto) {
        for (const param in query) {
            switch (param) {
                case 'categoryId':
                    return await this.categoryService.findProductsByCategoryId(query[param]);
                case 'categoryName':
                    return await this.categoryService.findProductsByCategoryName(query[param]);
                default:
                    throw new BadRequestException(`Unknown query param: ${param}=${query[param]}`);
            }
        }
    }

    public async findOneById(uuid: string) {
        return await this.productRepository.findOneOrFail({ where: { uuid } });
    }

    update(id: number, updateProductDto: UpdateProductDto) {
        return `This action updates a #${id} product`;
    }

    remove(id: number) {
        return `This action removes a #${id} product`;
    }
}
