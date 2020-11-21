import * as Discord from 'discord.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DiscordContext } from '../discord-context';

@Injectable()
export class GenericGuard implements CanActivate {
    private readonly test: (...args: any[]) => boolean;
    constructor(test: (message: Discord.Message) => boolean) {
        this.test = test;
    }
    canActivate(context: ExecutionContext): boolean {
        const rpcCtx = context.switchToRpc();
        const ctx: DiscordContext<'message'> = rpcCtx.getContext();
        const message = ctx.getArgByIndex(0);
        return this.test(message);
    }
}
