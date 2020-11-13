import { DiscordContext } from './discord-context';

import * as Discord from 'discord.js';
type SendParams = Parameters<Discord.PartialTextBasedChannelFields['send']>;
export interface MessageController {
  messageEvent(message: string, ctx: DiscordContext): SendParams;
}
