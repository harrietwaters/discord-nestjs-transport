import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Discord from 'discord.js';
import { DiscordConfigService } from '../discord-config';

interface DiscordTransportConfigOptions {
  token: string;
}

export type DiscordClientProviderOptions = DiscordTransportConfigOptions &
  Partial<Discord.ClientOptions>;

@Injectable()
export class DiscordClientProvider {
  private readonly logger: Logger;
  private readonly _client: Discord.Client;
  private readonly config: DiscordConfigService;

  constructor(config: DiscordConfigService, logger: Logger) {
    this.logger = logger;
    this.config = config;
    this._client = new Discord.Client();

    this._client.on('ready', () => this.logger.log('Discord client is ready'));
    this._client.on('disconnect', () =>
      this.logger.log('Discord client has disconnected'),
    );
    this._client.on('error', err => this.logger.error(err));
  }

  public get client(): Discord.Client {
    return this._client;
  }

  public async login(): Promise<void> {
    this.client.login(this.config.discordClientToken);
  }

  public async subscribeEvent(
    event: string,
    handler: (...args: any) => any,
  ): Promise<void> {
    this.client.on(event, handler);
  }

  public destroy() {
    this.client.destroy();
  }
}
