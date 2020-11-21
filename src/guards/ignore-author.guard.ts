import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DiscordContext } from '../discord-context';

@Injectable()
export class IgnoreAuthorGuard implements CanActivate {
    private readonly authorId: string;
    constructor(authorId: string) {
        this.authorId = authorId;
    }
    canActivate(context: ExecutionContext): boolean {
        const rpcCtx = context.switchToRpc();
        const ctx: DiscordContext<'message'> = rpcCtx.getContext();
        const messageAuthor = ctx.getArgByIndex(0)?.author?.id;

        return this.authorId === messageAuthor;
    }
}
