import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entity/comment.entity';
import { TokenService } from 'src/token/token.service';
import { LikeService } from 'src/like/like.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entity/product.entity';
import { CreateCommentDto } from './dto/create-comment';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductTranslateEntity } from 'src/entity/product_t.entity';
import { CartService } from 'src/cart/cart.service';
import { Xitem } from 'src/entities_from_db/entities/xitem.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,

        @InjectRepository(ProductTranslateEntity)
        private productTranslateRepository: Repository<ProductTranslateEntity>,

        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,

        private readonly likeService: LikeService,

        private readonly tokenService: TokenService,

        private readonly categoryService: CategoriesService,

        @Inject(forwardRef(() => CartService))
        private readonly cartService: CartService,
    ) {}

    public async createComment(
        newComment: CreateCommentDto,
        token: string,
        productId: number
    ) {
        const userPayload = await this.tokenService.verifyToken(
            token,
            'access'
        );
        if (!userPayload.id) {
            throw new UnauthorizedException();
        }

        return await this.commentRepository.save({
            text: newComment.text,
            rating: newComment.rating,
            user: { id: userPayload.id },
            product: { id: productId },
        });
    }

    public async getAll(language: string) {
        const res =  await this.productRepository
            .createQueryBuilder('product')
            .select(['product.uuid', 'product.id', 'product.createdAt', 'product.price_currency'])
            .leftJoinAndSelect('product.category', 'category')
            .leftJoin('category.translate', 'category_t')
            .addSelect(['category_t.name', 'category_t.language'])
            .leftJoin('product.translate', 'product_t')
            .addSelect(['product_t.title', 'product_t.language'])
            .where('product_t.language = :language', { language })
            .andWhere('category_t.language = :language', { language })
            .getMany();

        return res.map(product => {
            // Extract the necessary translations from the nested arrays
            const categoryTranslation = product.category.translate[0];
            const productTranslation = product.translate[0];

            // Return the transformed product
            return {
                id: product.id,
                uuid: product.uuid,
                createdAt: product.createdAt,
                price_currency: product.price_currency,
                category: {
                id: product.category.id,
                uuid: product.category.uuid,
                createdAt: product.category.createdAt,
                updatedAt: product.category.updatedAt,
                image: product.category.image,
                name: categoryTranslation?.name,
                language: categoryTranslation?.language,
                },
                title: productTranslation?.title,
                language: productTranslation?.language,
            };
        });    
    }

    public async getOneWithComments(uuid: string, language: string, token?: string) {
        // const res = await this.productRepository.findOne({
        //     where: { uuid },
        //     relations: ['comments', 'comments.user', 'category'],
        // });
        console.log('uuid => ', uuid);
        console.log('language => ', language);
        const res = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.comments', 'comments')
            .leftJoinAndSelect('comments.user', 'commentUser')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoin('product.translate', 'product_t')
            .addSelect(['product_t.title', 'product_t.language', 'product_t.shortDesc', 'product_t.desc'])
            .leftJoin('category.translate', 'category_t')
            .addSelect(['category_t.name', 'category_t.language'])
            .where('product.uuid = :productUid', { productUid: uuid })
            .andWhere('product_t.language = :language', { language })
            .andWhere('category_t.language = :language', { language })
            .getOne();

        console.log('res => ', res);
 
        let updatedRes;
        const { translate, ...other } = res;
        updatedRes = {
            ...other,
            title: translate[0].title,
            desc: translate[0].desc,
            shortDesc: translate[0].shortDesc,
            language: translate[0].language,
        }

        if (!token) {
            return updatedRes;
        }

        let userPayload;
        try {
            userPayload = await this.tokenService.verifyToken(token, 'access');
        } catch (e) {
            console.log('[WARN] User is not authorized! Token => ', token);
            return;
        }

        return {
            ...updatedRes,
            like: await this.likeService.findOne(userPayload.id, res.id),
        };
    }

    public async findOneByUid(uuid: string) {
        return await this.productRepository.findOne({
            where: { uuid },
        });
    }

    public async findOneById(id: number) {
        return await this.productRepository.findOne({
            where: { id },
        });
    }

    public async likeProduct(productUuid: string, token: string) {
        const userPayload = await this.tokenService.verifyToken(
            token,
            'access'
        );

        const product = await this.findOneByUid(productUuid);

        return await this.likeService.setLike(userPayload.uuid, product);
    }

    public async create(createProductDto: Omit<CreateProductDto, 'rating'>) {
        const category = await this.categoryService.findSubcategoryById(
            createProductDto.categoryId
        );

        const newProduct = await this.productRepository.create({
            ...createProductDto,
            rating: 0,
            category: category,
        });

        const translations = [];
        for (const translation of createProductDto.translate) {
            console.log('Translation: ', translation);
            const newTranslate = await this.productTranslateRepository.save(translation);
            translations.push(newTranslate);
        }

        newProduct.translate = translations;
        return await this.productRepository.save(newProduct);
    }

    async update(uuid: string, updateProductDto: UpdateProductDto, language: string) {
        const queryBulder = this.productRepository
            .createQueryBuilder('product')
            .where('product.uuid = :productUid', { productUid: uuid });
            if(updateProductDto.translate) {
                queryBulder.leftJoinAndSelect('product.translate', 'product_t')
                    .andWhere('product_t.language = :language', { language });
            }

        const product = await queryBulder.getOne();

        if (!product) {
            throw new BadRequestException('Wrong uuid!');
        }

        if ('translate' in updateProductDto) {
            const { translate, ...other } = updateProductDto;

            await this.productTranslateRepository.save({
                ...product.translate[0],
                ...updateProductDto.translate,
            });
            return await this.productRepository.save({
                ...product,
                ...other,
            });
        } else {
            return await this.productRepository.save({
                ...product,
                ...updateProductDto as Partial<ProductEntity>,
            });
        }
    }

    async delete(uuid: string) {
        const product = await this.productRepository.findOneByOrFail({ uuid });

        // delete all relations
        // translation
        await this.deleteTranslationsByProduct(product.id);
        // likes
        await this.likeService.deleteLikesByProduct(product.id);
        // cart
        await this.cartService.deleteByProductId(product.id);
        // comments
        await this.deleteCommentsByProduct(product.id);

        return await this.productRepository.remove(product);
    }

    async deleteTranslationsByProduct(productId: number) {
        return await this.productTranslateRepository
            .createQueryBuilder('product_t')
            .delete()
            .from(ProductTranslateEntity)
            .where('product_t."product_id" = :productId', { productId })
            .execute()
    }

    async deleteCommentsByProduct(productId: number) {
        return await this.commentRepository
            .createQueryBuilder('comment')
            .delete()
            .from(CommentEntity)
            .where('comment."product_id" = :productId', { productId })
    }

    // public async findAllByQuery(query: ProductQueryDto) {
    //     const queryBuilder = this.productRepository.createQueryBuilder();

    //     for (const param in query) {
    //         switch (param) {
    //             case 'categoryId':
    //                 return await this.categoryService.findProductsByCategoryId(
    //                     query[param]
    //                 );
    //             case 'categoryName':
    //                 return await this.categoryService.findProductsByCategoryName(
    //                     query[param]
    //                 );
    //             case 'isTop':
    //                 queryBuilder.orderBy('price_currency', 'ASC');
    //                 break;
    //             case 'isRelevant':
    //                 queryBuilder.orderBy('price_currency', 'DESC');
    //                 break;
    //             case 'take':
    //                 queryBuilder.take(query[param] as number);
    //                 break;
    //             default:
    //                 throw new BadRequestException(
    //                     `Unknown query param: ${param}=${query[param]}`
    //                 );
    //         }
    //     }

    //     // if no params - return all
    //     return await queryBuilder.getMany();
    // }
    // //const queryBuilder = this.productRepository.createQueryBuilder('product');
    // //
    // //         for (const param in query) {
    // //             switch (param) {
    // //                 case 'categoryId':
    // //                     queryBuilder.innerJoin('product.category', 'category', `category.id = :${param}`, { [param]: query[param] });
    // //                     break;
    // //                 case 'categoryName':
    // //                     queryBuilder.innerJoin('product.category', 'category', `category.name = :${param}`, { [param]: query[param] });
    // //                     break;
    // //                 default:
    // //                     throw new BadRequestException(`Unknown query param: ${param}=${query[param]}`);
    // //             }
    // //         }
    // //
    // //         return queryBuilder.getMany();

    // public async findOneById(uuid: string) {
    //     return await this.productRepository.findOneOrFail({ where: { uuid } });
    // }

    // update(id: number, updateProductDto: UpdateProductDto) {
    //     return `This action updates a #${id} product`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} product`;
    // }
}
