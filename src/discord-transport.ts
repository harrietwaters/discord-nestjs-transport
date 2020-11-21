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
    constructor(opts: DiscordTransportOptions) {
        super();
        this.client = new Discord.Client(opts);
        this.token = opts.token;
    }

    public listen(callback: () => void): void {
        this.client.login(this.token).then(() => this.bindHandlers().then(callback));
    }

    public async bindHandlers() {
        this.messageHandlers.forEach((handler, pattern: keyof Discord.ClientEvents) => {
            if (!handler.isEventHandler) return;
            const deuniqifiedPattern = pattern.split('-').shift();
            this.client.on(deuniqifiedPattern, async (...args: any[]) => {
                const ctx = new DiscordContext<any>(...args);

                const content = (args[0] as Discord.Message).cleanContent;

                const response$ = this.transformToObservable(
                    await handler(content, ctx),
                ) as Observable<any>;

                response$ && this.send(response$, () => true);
            });
        });
    }

    public close() {
        this.client.destroy();
    }
}
