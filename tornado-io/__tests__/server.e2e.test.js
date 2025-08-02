const request = require('supertest');
const { app } = require('../server');

describe('server e2e', () => {
  test('serves index.html on root', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<canvas id="game"');
  });
});
