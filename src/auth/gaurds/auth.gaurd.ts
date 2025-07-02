import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const { req } = GqlExecutionContext.create(context).getContext<{ req: any }>();
        const user = req.user;

        if (!user) {
        throw new UnauthorizedException('Authentication required');
        }

        return true;
    }
}