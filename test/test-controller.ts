import { Controller, UseGuards } from '@nestjs/common';
import { Ctx, Payload } from '@nestjs/microservices';
import * as _ from 'lodash';
import { DiscordEvent } from '../src/decorators/discord-event.decorator';
import { DiscordContext } from '../src/discord-context';
import { ContainsText } from '../src/guards/contains-text.guard';

export const messageEventMock = jest.fn().mockImplementation(_.identity);
export const textGuardTestMock = jest.fn().mockImplementation(_.identity);
export const regExpGuardTestMock = jest.fn().mockImplementation(_.identity);

@Controller()
export class TestController {
    @DiscordEvent('message')
    messageEvent(@Payload() message: string, @Ctx() ctx: DiscordContext<'message'>) {
        return messageEventMock(message, ctx);
    }

    @DiscordEvent('message')
    @UseGuards(new ContainsText('msg'))
    textGuardTest(message: string) {
        return textGuardTestMock(message);
    }

    @DiscordEvent('message')
    @UseGuards(new ContainsText(/^abc.*/))
    regExpGuardTest(message: string) {
        return regExpGuardTestMock(message);
    }
}
