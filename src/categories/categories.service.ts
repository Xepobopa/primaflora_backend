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
                WITH RECURSIVE category_path (id, name, path) AS
                (
                  SELECT id, name, name as path
                    FROM category
                    WHERE "name" = '${category}'
                  UNION ALL
                  SELECT c.id, c.name, CONCAT(cp.path, ' > ', c.name)
                    FROM category_path AS cp JOIN category AS c
                      ON cp.id = c."parentId"
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

    public async findProductsByCategoryId(id: number) {
        // set loadRelationIds to show products ids
        // set relations: { products: true } to show products
        return await this.categoryRepository.findOneOrFail({
            where: { id },
            relations: { products: true },
        });
    }

    public async findOneById(id: number) {
        return await this.categoryRepository.findOneOrFail({ where: { id } });
    }

    public async findOne(uuid: string) {
        return;
    }
}
