import {
  Server,
  CustomTransportStrategy,
  WritePacket,
} from '@nestjs/microservices';
import {} from '@nestjs/common';
import * as _ from 'lodash';
import * as Discord from 'discord.js';
import { DiscordContext } from './discord-context';
import { Observable } from 'rxjs';
import { DiscordClientProvider } from './discord-client/discord-client.provider';

interface DiscordTransportConfigOptions {
  client: DiscordClientProvider;
}

export type DiscordTransportOptions = DiscordTransportConfigOptions &
  Partial<Discord.ClientOptions>;

export class DiscordTransport extends Server
  implements CustomTransportStrategy {
  private readonly client: DiscordClientProvider;
  private readonly token: string;
  constructor(opts: DiscordTransportConfigOptions) {
    super();
    this.client = opts.client;
  }

  public listen(callback: () => void): void {
    this.client.login().then(() => {
      this.bindHandlers();
      return callback();
    });
  }

  public bindHandlers() {
    this.messageHandlers.forEach(
      (handler, pattern: keyof Discord.ClientEvents) => {
        if (!handler.isEventHandler) return;
        const deuniqifiedPattern = pattern.split('-').shift();
        this.client.subscribeEvent(deuniqifiedPattern, (eventData: any) => {
          const ctx = new DiscordContext([eventData]);

          const respond = (
            response: WritePacket,
          ): void | Promise<Discord.Message> => {
            return (
              typeof response.response === 'string' &&
              eventData?.channel?.send &&
              eventData.channel.send(response.response)
            );
          };
          const response$ = this.transformToObservable(
            handler(eventData.content, ctx),
          ) as Observable<any>;

          response$ && this.send(response$, respond);
        });
      },
    );
  }

  public close() {
    this.client.destroy();
  }
}
