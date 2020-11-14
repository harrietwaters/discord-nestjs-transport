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
    const [, ctx] = context.getArgs();
    const cleanContent = (ctx as DiscordContext).getMessage().cleanContent;

    return this.re.test(cleanContent);
  }
}
