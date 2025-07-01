import { CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { GqlExecutionContext } from "@nestjs/graphql"; 

export class RolesGaurd implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler, context.getClass]);

        if(!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        // Get the user
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        const user = req.user;
        
        if(!user) {
            throw new NotFoundException('User not found')
        }

        const hasRole = requiredRoles.some(role => user.roles?.includes(role));

        if(!hasRole) {
            throw new ForbiddenException(`User role [${user.roles}] does not include any of [${requiredRoles}]`)
        }

        return true;
    }
}