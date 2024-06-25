import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { SubcategoryEntity } from 'src/entity/subcategory.entity';
import { LikeService } from 'src/like/like.service';
import { TokenService } from 'src/token/token.service';
import { SubcategoryDto } from './dto/subcategory.dto';
import { SubcategoryTranslateEntity } from 'src/entity/subcategory_t.entity';

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
        // const subcategory = await this.subcategoryRepository.findOneOrFail({
        //     where: { id: subcategoryId },
        //     relations: ['products', 'products.comments'],
        // });

        const subcategory = await this.subcategoryRepository
            .createQueryBuilder('subcategory')
            .leftJoinAndSelect('subcategory.products', 'product')
            .leftJoinAndSelect('product.comments', 'comment')
            .leftJoinAndSelect('subcategory.translate', 'subcategoryTranslate')
            .leftJoinAndSelect('product.translate', 'productTranslate')
            .where('subcategory.id = :subcategoryId', { subcategoryId })
            .andWhere('productTranslate.language = :language', { language })
            .andWhere('subcategoryTranslate.language = :language', { language })
            .getOne();

        // TODO: return confort data
        if (!token) {
            return subcategory;
        }

        const userPayload = await this.tokenService.verifyToken(
            token,
            'access'
        );

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
