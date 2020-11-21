import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { DiscordContext } from '../discord-context';

@Injectable()
export class ContainsText implements CanActivate {
    private readonly re: RegExp;
    constructor(text: RegExp | string) {
        this.re = _.isString(text) ? new RegExp(text, 'mi') : (text as RegExp);
    }
    canActivate(context: ExecutionContext): boolean {
        const rpcCtx = context.switchToRpc();
        const ctx: DiscordContext<'message'> = rpcCtx.getContext();
        const cleanContent = ctx.getArgByIndex(0)?.cleanContent;

        return this.re.test(cleanContent);
    }
}
