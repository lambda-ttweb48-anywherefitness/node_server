const request = require('supertest');
const server = require('../api/app.js');

it('correct env', () => {
  expect(process.env.NODE_ENV).toBe('testing');
});

describe('index router endpoints', () => {
  describe('GET /', () => {
    it('should return json with api:up', async () => {
      const res = await request(server).get('/');
      expect(res.status).toBe(200);
      expect(res.body.api).toBe('up');
    });

    it('should return 404 for /ping', async () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      const res = await request(server).get('/ping');
      expect(res.status).toBe(404);
    });

    it('should return 404 for missing api resource', async () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      const res = await request(server).get('/api/foobar');
      expect(res.status).toBe(404);
    });
  });
});
