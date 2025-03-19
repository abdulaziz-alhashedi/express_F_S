import request from 'supertest';
import app from '../src/app';

describe('GET /api/health', () => {
  it('should return status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ status: 'OK' });
  });
});
