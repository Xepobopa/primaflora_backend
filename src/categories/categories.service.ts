import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { SubcategoryEntity } from 'src/entity/subcategory.entity';
import { LikeService } from 'src/like/like.service';
import { TokenService } from 'src/token/token.service';
import { SubcategoryDto } from './dto/subcategory.dto';
import { SubcategoryTranslateEntity } from 'src/entity/subcategory_t.entity';
import { ProductDto } from 'src/products/dto/product.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoryEntity)
        private categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(SubcategoryEntity)
        private subcategoryRepository: Repository<SubcategoryEntity>,
        @InjectRepository(SubcategoryTranslateEntity)
        private subcategoryTranslateRepository: Repository<SubcategoryTranslateEntity>,
        private readonly likeService: LikeService,
        private readonly tokenService: TokenService
    ) {}

    public async createSubcategory(subcategory: SubcategoryDto) {
        const parent = await this.categoryRepository.findOneOrFail({
            where: { uuid: subcategory.parent_uid },
        });

        const newSubcategory = await this.subcategoryRepository.create({
            image: subcategory.image,
            parent: parent,
        });

        const translations = [];
        for (const translation of subcategory.translate) {
            const newTranslate = await this.subcategoryTranslateRepository.save(
                {
                    name: translation.name,
                    desc: translation.desc,
                    language: translation.language,
                }
            );
            console.log('new translate => ', newTranslate);
            translations.push(newTranslate);
        }

        newSubcategory.translate = translations;
        return await this.subcategoryRepository.save(newSubcategory);
    }

    public async getSubcategory(uuid: string) {
        return await this.subcategoryRepository.findOneOrFail({
            where: { uuid },
            relations: ['translate'],
        });
    }

    public async findSubcategoryById(id: number) {
        return await this.subcategoryRepository.findOneOrFail({
            where: { id },
        });
    }

    public async findAllWithSub(language: string = 'ukr') {
        // return await this.categoryRepository.find({ relations: ['childrens'] });
        const categories = await await this.categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.childrens', 'subcategory')
            .leftJoinAndSelect('subcategory.translate', 'subcategoryTranslate')
            .where('subcategoryTranslate.language = :language', { language })
            .getMany();

        const transformCategories = categories.map(category => {
            return {
                id: category.id,
                uuid: category.uuid,
                name:
                    language === 'ukr' ? category.name_ukr : category.name_rus,
                childrens: category.childrens.map(subcategory => {
                    return {
                        id: subcategory.id,
                        uuid: subcategory.uuid,
                        image: subcategory.image,
                        name: subcategory.translate[0].name,
                        desc: subcategory.translate[0].desc,
                        language: subcategory.translate[0].language,
                    };
                }),
            };
        });

        return transformCategories;
    }

    public async findSubcategoryWithProducts(
        subcategoryId: number,
        language: string,
        token?: string
    ) {
        const subcategory = await this.subcategoryRepository
            .createQueryBuilder('subcategory')
            .leftJoinAndSelect('subcategory.products', 'product')
            .leftJoinAndSelect('product.comments', 'comment')
            .leftJoinAndSelect('subcategory.translate', 'subcategoryTranslate')
            .leftJoin('product.translate', 'product_t')
            .addSelect(["product_t.title", "product_t.language", "product_t.shortDesc"])
            .where('subcategory.id = :subcategoryId', { subcategoryId })
            .andWhere('product_t.language = :language', { language })
            .andWhere('subcategoryTranslate.language = :language', { language })
            .getOne();

        console.log("response => ", subcategory);

        if (!subcategory?.products) {
            return {
                ...subcategory,
                products: []
            };
        }

        // return data without likes
        if (!token) {
            return {
                ...subcategory,
    
                products: subcategory.products.map(product => {
                    const { translate, ...other } = product;

                    return {
                        ...other,
                        title: translate[0].title,
                        shortDesc: translate[0].shortDesc,
                        language: translate[0].language,
                        comments: product.comments.length,
                    }
                })
            };
        }

        const userPayload = await this.tokenService.verifyToken(
            token,
            'access'
        );


        // if user is defined, mark what products he liked
        return {
            ...subcategory,

            products: await Promise.all(
                subcategory.products.map(async product => {
                    const { translate, ...other } = product;

                    return {
                        ...other,
                        title: product.translate[0].title,
                        shortDesc: product.translate[0].shortDesc,
                        language: product.translate[0].language,
                        comments: product.comments.length,
                        like: await this.likeService.findOne(
                            userPayload.id,
                            product.id
                        ),
                    }
                })
            ),
        };
    }
}
