import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DiscordContext } from '../discord-context';
import { setClassName } from '../utilities/set-class-name';

@Injectable()
abstract class ContentLengthGuard implements CanActivate {
    protected abstract min: number;
    protected abstract max: number;
    canActivate(context: ExecutionContext): boolean {
        const rpcCtx = context.switchToRpc();
        const ctx: DiscordContext<'message'> = rpcCtx.getContext();
        const cleanContent = ctx.getArgByIndex(0)?.cleanContent || '';
        return cleanContent.length >= this.min && cleanContent.length <= this.max;
    }
}

export function ContentLength(min: number, max?: number): typeof ContentLengthGuard {
    class CustomContainsText extends ContentLengthGuard {
        protected min = min;
        protected max = max || Infinity;
    }

    return setClassName(CustomContainsText, `ContentLength-${min}-${max || 'Infinity'}`);
}
