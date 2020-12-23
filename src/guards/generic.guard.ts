import * as Discord from 'discord.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DiscordContext } from '../discord-context';
import { setClassName } from '../utilities/set-class-name';
import { randomBytes } from 'crypto';

type TesterFunc = (...args: any[]) => Promise<boolean> | boolean;
@Injectable()
abstract class GenericGuard implements CanActivate {
    protected abstract test: TesterFunc;
    canActivate(context: ExecutionContext): Promise<boolean> | boolean {
        const rpcCtx = context.switchToRpc();
        const ctx: DiscordContext<'message'> = rpcCtx.getContext();
        const message = ctx.getArgByIndex(0);
        return this.test(message);
    }
}

export function Generic(test: TesterFunc): typeof GenericGuard {
    class CustomGenericGuard extends GenericGuard {
        test = test;
    }
    const uniqifier = randomBytes(16).toString('hex');
    return setClassName(CustomGenericGuard, uniqifier);
}
