import { applyDecorators } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { randomBytes } from 'crypto';
import * as Discord from 'discord.js';

export function DiscordEvent(event: keyof Discord.ClientEvents) {
    // This is a dumb hack - basically you can only have one hander per pattern
    // so we need make the patterns unique in order set multiple handers. We'll
    // undo this in the transport before registering the handler
    const uniqifier = randomBytes(16).toString('hex');
    return applyDecorators(EventPattern(`${event}-${uniqifier}`));
}
