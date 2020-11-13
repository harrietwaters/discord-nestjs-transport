import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscordClientProvider } from './discord-client.provider';

describe('DiscordClientProvider', () => {
  let service: DiscordClientProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigService],
      providers: [DiscordClientProvider],
    }).compile();

    service = module.get<DiscordClientProvider>(DiscordClientProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
