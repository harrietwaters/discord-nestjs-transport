import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as Discord from 'discord.js';
import { Observable } from 'rxjs';
import { DiscordContext } from './discord-context';

export interface DiscordLoginOptions {
    token: string;
}

export type DiscordTransportOptions = Partial<Discord.ClientOptions> & DiscordLoginOptions;

export class DiscordTransport extends Server implements CustomTransportStrategy {
    private readonly client: Discord.Client;
    private readonly token: string;
    private botId: string;

    constructor(opts: DiscordTransportOptions) {
        super();
        this.client = new Discord.Client(opts);
        this.token = opts.token;
    }

    public listen(callback: () => void): void {
        this.client.setMaxListeners(Infinity);
        this.client.login(this.token).then(() => {
            this.botId = this.client.user.id;
            this.bindHandlers().then(callback);
        });
    }

    public async bindHandlers() {
        this.messageHandlers.forEach((handler, pattern: keyof Discord.ClientEvents) => {
            if (!handler.isEventHandler) return;
            const deuniqifiedPattern = pattern.split('-').shift();
            this.client.on(deuniqifiedPattern, async (...args: any[]) => {
                const ctx = new DiscordContext<any>(...args);
                const message: Discord.Message = args[0];

                // We may want to listen to bot messages later, but for now just ignore them
                if (message?.author?.id === this.botId) return;

                const content = message.cleanContent;

                const response$ = this.transformToObservable(
                    await handler(content, ctx),
                ) as Observable<any>;

                const reply = (res: any) => {
                    if (typeof res.response === 'string') {
                        return message.reply(res.response);
                    }
                };

                response$ && this.send(response$, reply);
            });
        });
    }

    public close() {
        this.client.destroy();
    }
}
