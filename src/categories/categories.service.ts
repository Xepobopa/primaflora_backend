import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entity/category.entity';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>) {
    }

    public async create(createCategoryDto: CreateCategoryDto) {
        const parent = await this.categoryRepository.findOneOrFail({ where: { id: createCategoryDto.parent_id } });
        return this.categoryRepository.save({ parent, name: createCategoryDto.name  });
    }

    public async findAll() {
        return this
            .categoryRepository
            .query(`
                WITH RECURSIVE category_path (id, name, path) AS
                (
                  SELECT id, name, name as path
                    FROM category
                    WHERE "parentId" IS NULL
                  UNION ALL
                  SELECT c.id, c."name", CONCAT(cp.path, ' > ', c.name)
                    FROM category_path AS cp JOIN category AS c
                      ON cp.id = c."parentId"
                )
                SELECT * FROM category_path
                ORDER BY path;
            `);
    }

    public async findByCategoryName(category: string) {
        return this
            .categoryRepository
            .query(`
                WITH category_path (id, name, path) AS
                (
                  SELECT id, name, name as path
                    FROM category
                    WHERE "name" = '${category}'
                  UNION ALL
                  SELECT c.id, c.name, CONCAT(cp.path, ' > ', c.name)
                )
                SELECT * FROM category_path
                ORDER BY path;
            `);
    }

    public async findProductsByCategoryName(category: string) {
        // set loadRelationIds to show products ids
        // set relations: { products: true } to show products
        return await this.categoryRepository.findOneOrFail({
            where: { name: category },
            relations: { products: true },
        });
    }

    /**
     * Return only subcategories, not sub...subcategories
     *         Example.     Categories in db:
     *                              MAIN
     *               PC                               PRINTERS
     *         Desktop Laptop               BlackAndWhite   Colored
     *         So findChildrenOnlyByCategoryName('MAIN') => [{..., name: 'PC', ...}, {..., name: 'PRINTERS', ...}]
     *         Or findChildrenOnlyByCategoryName('PC') => [{..., name: 'Desktop', ...}, {..., name: 'Laptop', ... }]
     * @param category - a name of a category, which children needed to get
     */
    public async findChildrenOnlyByCategoryName(category: string) {
        const categoryId = (await this.findOneByCategory(category)).id;
        return this.findChildrenOnlyByCategoryId(categoryId);
    }

    public async findChildrenOnlyByCategoryId(id: number) {
        return await this
            .categoryRepository
            .createQueryBuilder('category')
            .where('category.parentId = :pId', { pId: id })
            .loadAllRelationIds({ relations: ['parent'] })
            .getMany();
    }

    public async findProductsByCategoryId(id: number) {
        // set loadRelationIds to show products ids
        // set relations: { products: true } to show products
        return await this.categoryRepository.findOneOrFail({
            where: { id },
            relations: { products: true },
        });
    }

    public async findSiblingsById(id: number) {
        const parentId = (await this.findOneById(id)).parent;
        return this.categoryRepository
            .createQueryBuilder('category')
            .where('category.parentId = :pId', { pId: parentId })
            .loadAllRelationIds({ relations: ['parent'] })
            .getMany();
    }

    public async findOneById(id: number) {
        return await this.categoryRepository.findOneOrFail({ where: { id }, loadRelationIds: { relations: ['parent'] } });
    }

    public async findOneByCategory(category: string) {
        return await this.categoryRepository.findOneOrFail({ where: { name: category } });
    }
}
