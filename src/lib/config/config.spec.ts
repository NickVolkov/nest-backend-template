import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { z } from 'zod';

import { getConfig } from '@/lib/config/config';
import { s } from '@/lib/config/schema';

describe('getConfig', () => {
  it('loads YAML defaults and overlays environment-shaped values', () => {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'nest-config-'));
    fs.writeFileSync(path.join(folder, 'config.yml'), 'server:\n  port: 3000\n  enabled: false\n');

    const previousPort = process.env.SERVER_PORT;
    const previousEnabled = process.env.SERVER_ENABLED;
    process.env.SERVER_PORT = '4000';
    process.env.SERVER_ENABLED = 'true';

    try {
      const schema = z.object({
        server: z.object({ port: s.int(), enabled: s.boolean() }),
      });

      expect(getConfig(schema, { folder, files: ['config.yml'] })).toEqual({
        server: { port: 4000, enabled: true },
      });
    } finally {
      if (previousPort === undefined) delete process.env.SERVER_PORT;
      else process.env.SERVER_PORT = previousPort;
      if (previousEnabled === undefined) delete process.env.SERVER_ENABLED;
      else process.env.SERVER_ENABLED = previousEnabled;
      fs.rmSync(folder, { recursive: true });
    }
  });
});
