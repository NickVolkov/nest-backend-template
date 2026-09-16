import { HealthController } from '@/primary-adapters/api/controllers/health.controller';

describe('HealthController', () => {
  it('reports a healthy service', () => {
    expect(new HealthController().health()).toEqual({ status: 'ok' });
  });
});
