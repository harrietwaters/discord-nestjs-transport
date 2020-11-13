import { BaseRpcContext } from '@nestjs/microservices/ctx-host/base-rpc.context';
import * as Discord from 'discord.js';

type DiscordContextArgs = [Discord.Message];

export class DiscordContext extends BaseRpcContext<DiscordContextArgs> {
  constructor(args: DiscordContextArgs) {
    super(args);
  }

  /**
   * Returns the Discord Message instance
   */
  getMessage(): Discord.Message {
    return this.args[0];
  }
}
