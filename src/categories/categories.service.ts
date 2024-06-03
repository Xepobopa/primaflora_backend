import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { SubcategoryEntity } from 'src/entity/subcategory.entity';
import { LikeService } from 'src/like/like.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoryEntity)
        private categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(SubcategoryEntity)
        private subcategoryRepository: Repository<SubcategoryEntity>,
        private readonly likeService: LikeService,
        private readonly tokenService: TokenService
    ) {}

    public async findAllWithSub() {
        return await this.categoryRepository.find({ relations: ['childrens'] });
    }

    public async findSubcategoryWithProducts(
        subcategoryId: number,
        token: string
    ) {
        const userPayload = await this.tokenService.verifyToken(
            token,
            'access'
        );

        const subcategory = await this.subcategoryRepository.findOneOrFail({
            where: { id: subcategoryId },
            select: {
                id: true,
                uuid: true,
                desc: true,
                image: true,
                name: true,
                products: {
                    id: true,
                    uuid: true,
                    percent_discount: true,
                    price_currency: true,
                    photo_url: true,
                    rating: true,
                    title: true,
                },
            },
            relations: ['products', 'products.comments'],
        });

        return {
            ...subcategory,
            products: await Promise.all(
                subcategory.products.map(async product => ({
                    ...product,
                    comments: product.comments.length,
                    like: await this.likeService.findOne(
                        userPayload.id,
                        product.id
                    ),
                }))
            ),
        };
    }
}
