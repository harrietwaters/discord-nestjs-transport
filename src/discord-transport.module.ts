import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { DiscordClientProvider } from './discord-client/discord-client.provider';
import { DiscordConfigService } from './discord-config/discord-config.service';

interface DiscordModuleOptions {
  token: string;
}

@Module({})
export class DiscordTransportModule {
  static register(options: DiscordModuleOptions): DynamicModule {
    return {
      module: DiscordTransportModule,
      imports: [
        ConfigModule.forRoot({
          load: [
            () => {
              return { token: options.token };
            },
          ],
        }),
      ],
      providers: [DiscordClientProvider, DiscordConfigService],
      exports: [DiscordClientProvider, DiscordConfigService],
    };
  }
}
