import * as Discord from 'discord.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DiscordContext } from '../discord-context';
import { Observable } from 'rxjs';

@Injectable()
export class GenericGuard implements CanActivate {
  private readonly test: (...args: any[]) => boolean;
  constructor(test: (message: Discord.Message) => boolean) {
    this.test = test;
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const [, ctx] = context.getArgs();
    const message = (ctx as DiscordContext).getMessage();
    return this.test(message);
  }
}
