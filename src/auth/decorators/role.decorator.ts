import { SetMetadata } from "@nestjs/common";
import { Role } from "src/users/enum/role.enum";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)



// import { Reflector } from "@nestjs/core";

// export const RolesV1 = Reflector.createDecorator<Role[]>()