import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordConfigService {
  constructor(private readonly configService: ConfigService) {}

  get discordClientToken(): string {
    return this.configService.get<string>('discordClientToken');
  }
}
