import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { DiscordContext } from '../discord-context';
import { setClassName } from '../utilities/set-class-name';

@Injectable()
abstract class ContainsTextGuard implements CanActivate {
    protected abstract re: RegExp;
    canActivate(context: ExecutionContext): boolean {
        const rpcCtx = context.switchToRpc();
        const ctx: DiscordContext<'message'> = rpcCtx.getContext();
        const cleanContent = ctx.getArgByIndex(0)?.cleanContent;
        return this.re.test(cleanContent);
    }
}

export function ContainsText(text: RegExp | string): typeof ContainsTextGuard {
    class CustomContainsText extends ContainsTextGuard {
        protected re = _.isString(text) ? new RegExp(text, 'mi') : (text as RegExp);
    }

    return setClassName(CustomContainsText, text.toString());
}
