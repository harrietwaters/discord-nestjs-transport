import { applyDecorators, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { randomBytes } from 'crypto';
import * as Discord from 'discord.js';
import { ContentLength } from '../guards/content-length.guard';

export interface DiscordEventOptions {
    allowEmptyMessage?: boolean;
}

export function DiscordEvent(
    event: keyof Discord.ClientEvents,
    eventOptions?: DiscordEventOptions,
) {
    // This is a dumb hack - basically you can only have one hander per pattern
    // so we need make the patterns unique in order set multiple handers. We'll
    // undo this in the transport before registering the handler
    const uniqifier = randomBytes(16).toString('hex');
    const decorators = [EventPattern(`${event}-${uniqifier}`)];
    if (!eventOptions?.allowEmptyMessage) decorators.push(UseGuards(ContentLength(1)));

    return applyDecorators(...decorators);
}
