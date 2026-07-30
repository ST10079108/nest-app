import { UsersModule } from '../users.module';
import { Test } from '@nestjs/testing';

describe('UsersModule', () => {
  it('compiles', async () => {
    const module = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
