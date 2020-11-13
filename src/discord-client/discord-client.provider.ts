import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import {isNil} from 'lodash';
import * as Discord from 'discord.js';

interface DiscordTransportConfigOptions {
  token: string;
}

export type DiscordClientProviderOptions = DiscordTransportConfigOptions &
  Partial<Discord.ClientOptions>;

@Injectable()
export class DiscordClientProvider {
  private readonly logger: Logger;
  private readonly _client: Discord.Client;
  private readonly configService: ConfigService<Record<string, any>>;

  constructor(configService: ConfigService) {
    this.configService = configService;
    this._client = new Discord.Client();

    this._client.on('ready', () => this.logger.log('Discord client is ready'));
    this._client.on('disconnect', () =>
      this.logger.log('Discord client has disconnected'),
    );
    this._client.on('error', err => this.logger.error(err));
  }

  onModuleInit() {
    return this._client.login(this.configService.get('discordClientToken'));
  }

  public get client(): Discord.Client {
    return this._client;
  }
}
