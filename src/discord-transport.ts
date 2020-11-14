import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import {} from '@nestjs/common';
import * as _ from 'lodash';
import * as Discord from 'discord.js';
import { DiscordContext } from './discord-context';
import { Observable } from 'rxjs';
import { DiscordClientProvider } from './discord-client/discord-client.provider';

interface DiscordTransportConfigOptions {
  token: string;
}

export type DiscordTransportOptions = DiscordTransportConfigOptions &
  Partial<Discord.ClientOptions>;

export class DiscordTransport extends Server
  implements CustomTransportStrategy {
  private readonly client: Discord.Client;
  private readonly token: string;
  constructor(client: DiscordClientProvider) {
    super();

    this.client = client.client;
  }

  public getDiscordClient(): Discord.Client {
    return this.client;
  }

  public listen(callback: () => void): void {
    this.client.login(this.token).then(() => {
      this.bindHandlers();
      return callback();
    });
  }

  public bindHandlers() {
    this.messageHandlers.forEach(
      (handler, pattern: keyof Discord.ClientEvents) => {
        if (!handler.isEventHandler) return;
        const deuniqifiedPattern = pattern.split('-').shift();
        this.client.on(deuniqifiedPattern, async (eventData: any) => {
          const ctx = new DiscordContext([eventData]);

          const send = _.get(eventData, 'channel.send', _.identity);

          const respond = (response: any): void | Promise<Discord.Message> => {
            return response && send(response);
          };
          const response$ = this.transformToObservable(
            await handler(eventData.content, ctx),
          ) as Observable<any>;

          response$ && this.send(response$, respond);
        });
      },
    );
  }

  public async close(): Promise<void> {
    this.client.destroy();
  }
}
