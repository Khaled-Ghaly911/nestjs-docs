import { CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { GqlExecutionContext } from "@nestjs/graphql"; 
import { Role } from "src/users/enum/role.enum";
import { ROLES_KEY } from "../decorators/role.decorator";

export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler, context.getClass]);

        if(!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        // Get the user
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        const user = req.user;
        console.log(`The user in roles guard: ${user}`);
        
        if(!user) {
            throw new NotFoundException('User not found Inside Roles Guard')
        }

        const hasRole = requiredRoles.some(role => user.role?.includes(role));

        if(!hasRole) {
            throw new ForbiddenException(`User role [${user.role}] does not include any of [${requiredRoles}]`)
        }

        return true;
    }
}