/* eslint-disable @typescript-eslint/ban-ts-comment */

import { INestMicroservice } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as Discord from 'discord.js';
import { DiscordConfigService } from '../src/discord-config';
import { DiscordTransport } from '../src/discord-transport';
import {
    messageEventMock,
    regExpGuardTestMock,
    TestController,
    textGuardTestMock,
} from './test-controller';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const token = 'my-token';

const testMessageBase = {
    id: 'snowflake',
    author: { id: 'authorId' },
};

function emitMessage(client: Discord.Client, content: string): any {
    const spy = jest.fn();

    const message = Object.assign({}, testMessageBase, {
        content: content,
        cleanContent: content,
        channel: {
            send: spy,
        },
    }) as any;

    client.emit('message', message);
    return spy;
}

describe('Discord Custom Transport', () => {
    // @ts-ignore
    const loginMock: jest.Mock = Discord.Client.loginMock;

    let app: INestMicroservice;
    let discordTransport: DiscordTransport;
    let discordClient: Discord.Client;

    beforeEach(async done => {
        loginMock.mockClear();
        messageEventMock.mockClear();
        textGuardTestMock.mockClear();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [DiscordConfigService],
            controllers: [TestController],
        }).compile();

        discordTransport = new DiscordTransport({ token: token });
        app = await moduleFixture.createNestMicroservice({
            strategy: discordTransport,
        });

        await app.listen(() => done());
    });

    it('should login', () => {
        expect(loginMock).toHaveBeenCalled();
        expect(loginMock).toHaveBeenCalledWith(token);
    });

    it('should register a handler and pass the message', async () => {
        const msg = 'msg';
        emitMessage(discordClient, msg);
        await sleep(5);
        expect(messageEventMock).toHaveBeenCalledTimes(1);
        expect(messageEventMock).toHaveBeenLastCalledWith(
            msg,
            expect.objectContaining({ args: [testMessageBase] }),
        );
    });

    describe('ContainsText Guard', () => {
        beforeEach(() => {
            textGuardTestMock.mockReset();
            regExpGuardTestMock.mockReset();
        });

        it('should pass the message if it passes the text guard', async () => {
            const msg = 'msg';
            emitMessage(discordClient, msg);
            await sleep(5);
            expect(textGuardTestMock).toHaveBeenCalledTimes(1);
            expect(textGuardTestMock).toHaveBeenLastCalledWith(msg);
        });

        it('should not pass the message if it does not pass the text guard', async () => {
            const msg = 'foo';
            emitMessage(discordClient, msg);
            await sleep(5);
            expect(textGuardTestMock).toHaveBeenCalledTimes(0);
        });

        it('should pass the message if it passes the regular expression guard', async () => {
            const msg = 'abcdefg';
            emitMessage(discordClient, msg);
            await sleep(5);
            expect(regExpGuardTestMock).toHaveBeenCalledTimes(1);
            expect(regExpGuardTestMock).toHaveBeenLastCalledWith(msg);
        });

        it('should not pass the message if it does not pass the regular expression guard', async () => {
            const msg = 'aabcd';
            emitMessage(discordClient, msg);
            await sleep(5);
            expect(regExpGuardTestMock).toHaveBeenCalledTimes(0);
        });
    });
});
