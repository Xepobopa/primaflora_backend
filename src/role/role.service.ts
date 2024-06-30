import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/entity/role.entity';
import { EUserRole } from 'src/enum/role.enum';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>,
    ) {}

    public async findOne(roleName: EUserRole) {
        return await this.roleRepository.findOneByOrFail({ name: roleName });
    }
}
