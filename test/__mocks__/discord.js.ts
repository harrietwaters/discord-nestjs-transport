import { ModulesContainer } from '@nestjs/core';
import { EventEmitter } from 'events';

const Discord: any = jest.genMockFromModule('discord.js');

export const _login = jest.fn().mockResolvedValue('snowflake');
class ClientMock extends EventEmitter {
    login = _login;
}

Discord.Client = ClientMock;
Discord.Client.loginMock = _login;

module.exports = Discord;
