import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Xitem } from 'src/entities_from_db/entities/xitem.entity';
import { Repository } from 'typeorm';
import { GetAllQueryParmas } from './dto/getAll.query-params';

@Injectable()
export class XitemService {
    constructor (
        @InjectRepository(Xitem)
        private commentRepository: Repository<Xitem>,
    ) {}

    public async getAllByQuery(query: GetAllQueryParmas) {
        const queryBuilder = this.commentRepository.createQueryBuilder('xitem');

        for (const paramKey in query) {
            if (paramKey === 'take') {
                queryBuilder.take(query[paramKey]);
            }
            if (paramKey === 'getProducts') {
                queryBuilder.orWhere('xitem.parent IS NOT NULL');
            }
            if (paramKey === 'getCategories') {
                queryBuilder.orWhere('xitem.parent IS NULL');
            }
            if (paramKey === 'getActiveOnly') {
                queryBuilder.andWhere('xitem.inactive IS FALSE');
            }
            if (paramKey === 'parentUid') {
                queryBuilder.andWhere('xitem.parent = :parentUid', {
                    parentUid: query[paramKey],
                });
            }
        }

        return await queryBuilder.getMany();
    }
}
