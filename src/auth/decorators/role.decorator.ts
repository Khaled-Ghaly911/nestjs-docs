import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata('roles', roles)



// import { Reflector } from "@nestjs/core";

// export const RolesV1 = Reflector.createDecorator<string[]>()