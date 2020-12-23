import { BaseRpcContext } from '@nestjs/microservices/ctx-host/base-rpc.context';
import * as Discord from 'discord.js';

type ClientEvent = keyof Discord.ClientEvents;
type DiscordEventArgs<T extends ClientEvent> = Discord.ClientEvents[T];

export class DiscordContext<T extends ClientEvent = 'message'> extends BaseRpcContext<
    DiscordEventArgs<T>
> {
    constructor(...args: DiscordEventArgs<T>) {
        super(args);
    }

    getArgs(): DiscordEventArgs<T> {
        return super.getArgs();
    }

    getArgByIndex<I extends number>(index: I): DiscordEventArgs<T>[I] {
        return this.args[index];
    }
}
