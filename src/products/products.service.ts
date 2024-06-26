import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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

    public async getOneWithComments(uuid: string, token: string, language: string) {
        // const res = await this.productRepository.findOne({
        //     where: { uuid },
        //     relations: ['comments', 'comments.user', 'category'],
        // });
        const res = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.comments', 'comments')
            .leftJoinAndSelect('comments.user', 'commentUser')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoin('product.translate', 'product_t')
            .addSelect(['product_t.title', 'product_t.language', 'product_t.shortDesc', 'product_t.desc'])
            .where('product.uuid = :productUid', { productUid: uuid })
            .andWhere('product_t.language = :language', { language })
            .getOne()
 
        const { translate, ...other } = res;
        const updatedRes = {
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

    public async create(createProductDto: CreateProductDto) {
        const category = await this.categoryService.findSubcategoryById(
            createProductDto.categoryId
        );

        const newProduct = await this.productRepository.create({
            ...createProductDto,
            category: category,
        });

        const translations = [];
        for (const translation of createProductDto.translate) {
            const newTranslate = await this.productTranslateRepository.save(translation);
            translations.push(newTranslate);
        }

        newProduct.translate = translations;
        return await this.productRepository.save(newProduct);
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
