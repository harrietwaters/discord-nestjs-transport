import { applyDecorators, UseGuards } from '@nestjs/common/decorators';
import { ContainsText } from '../guards';
import { DiscordEvent } from './discord-event.decorator';

// export const Command = (...args: string[]) => SetMetadata('command', args);
export function Command(commandTrigger: string) {
    return applyDecorators(DiscordEvent('message'), UseGuards(ContainsText(commandTrigger)));
}
