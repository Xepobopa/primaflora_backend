import { SetMetadata } from "@nestjs/common";
import { EUserRole } from "src/enum/role.enum";

export const ROLE_METADATA_KEY = 'role';
export const Role = (role: EUserRole) => SetMetadata(ROLE_METADATA_KEY, role);