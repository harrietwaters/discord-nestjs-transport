import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DiscordContext } from '../discord-context';
import { setClassName } from '../utilities/set-class-name';

@Injectable()
abstract class IgnoreAuthorGuard implements CanActivate {
    protected abstract authorId: string;
    canActivate(context: ExecutionContext): boolean {
        const rpcCtx = context.switchToRpc();
        const ctx: DiscordContext<'message'> = rpcCtx.getContext();
        const messageAuthor = ctx.getArgByIndex(0)?.author?.id;

        return this.authorId === messageAuthor;
    }
}

export function IgnoreAuthor(authorId: string): typeof IgnoreAuthorGuard {
    class CustomIgnoreAuthor extends IgnoreAuthorGuard {
        protected authorId = authorId;
    }

    return setClassName(CustomIgnoreAuthor, authorId);
}
