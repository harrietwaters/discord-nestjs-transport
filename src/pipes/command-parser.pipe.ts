import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CommandArgs } from '../guards/command-args.guard';

@Injectable()
export class CommandParserPipe implements PipeTransform {
    private readonly commandArgs: CommandArgs;
    constructor(commandArgs?: CommandArgs) {
        this.commandArgs = commandArgs;
    }

    transform(value: string, metadata: ArgumentMetadata) {
        return value;
    }
}
