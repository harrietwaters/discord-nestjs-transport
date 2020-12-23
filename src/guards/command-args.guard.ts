import * as _ from 'lodash';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DiscordContext } from '../discord-context';
import { tokenizeCommandArgs } from '../utilities/tokenize-command-args';

export interface CommandArg {
    name: string;
    type: 'string' | 'number';
}

export type CommandArgs = CommandArg[];

@Injectable()
export class CommandArgsGuard implements CanActivate {
    private readonly commandArgs: CommandArgs;
    constructor(commandArgs?: CommandArgs) {
        this.commandArgs = commandArgs;
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const rpcCtx = context.switchToRpc();
        const ctx: DiscordContext<'message'> = rpcCtx.getContext();
        const message = ctx.getArgByIndex(0);
        const cleanContent = message?.cleanContent;

        if (_.isNil(message || _.isNil(cleanContent))) return;
        const userArgs = tokenizeCommandArgs(cleanContent);
        // Our first index is our command word, shift it out
        const command = userArgs.shift();

        const testedArgs: boolean[] = _.zip(userArgs, this.commandArgs).map(
            ([userArg, commandArg]) => {
                if (_.isNil(userArg) || _.isNil(commandArg)) return false;
                switch (commandArg.type) {
                    case 'string':
                        const quotes = RegExp(/^['"`].*?['"`]$/);

                        if (quotes.test(userArg)) {
                            userArg = userArg.slice(1, userArg.length - 1);
                        }
                        return true;
                    case 'number':
                        const parsedInt = parseInt(userArg);
                        if (!Number.isNaN(parsedInt)) {
                            return true;
                        }
                    default:
                        return false;
                }
            },
        );

        return testedArgs.every(_.identity)
            ? true
            : message.reply(this.getHelpStr(command)) && false;
    }

    private getHelpStr(commandName: string): string {
        const argHelp: string = this.commandArgs
            .map(commandArg => `${commandArg.name} ${commandArg.type}`)
            .join(' ');

        return `${commandName} ${argHelp}`;
    }
}
