import { EUserRole } from "src/enum/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('role')
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        type: 'enum',
        enum: EUserRole,
        default: EUserRole.USER
    })
    name: EUserRole;
}