import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordConfigService {
    private token: string;

    constructor(config: ConfigService) {
        this.token = config.get('token');
    }

    get discordClientToken(): string {
        return this.token;
    }
}
