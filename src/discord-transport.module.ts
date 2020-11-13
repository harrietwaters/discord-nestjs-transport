import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import discordConfig from './discord-config/discord-config.config';
import { DiscordClientProvider } from './discord-client/discord-client.provider';
import { DiscordConfigService } from './discord-config/discord-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [discordConfig],
    }),
  ],
  providers: [DiscordClientProvider, DiscordConfigService],
  exports: [DiscordClientProvider, DiscordConfigService],
})
export class DiscordTransportModule {}
