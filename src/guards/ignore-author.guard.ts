import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DiscordContext } from '../discord-context';

@Injectable()
export class IgnoreAuthorGuard implements CanActivate {
  private readonly authorId: string;
  constructor(authorId: string) {
    this.authorId = authorId;
  }
  canActivate(context: ExecutionContext): boolean {
    const [, ctx] = context.getArgs();
    return this.authorId === (ctx as DiscordContext).getMessage().author.id;
  }
}
