const request = require('supertest');
const server = require('../api/app');
const db = require('../data/db-config');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

//jest.mock('../data/dbInterface');

// // mock the auth middleware completely
//jest.mock('../api/middleware/auth', () => jest.fn((req, res, next) => next()));

describe('classes router endpoints', () => {
  beforeAll(() => {
    //jest.clearAllMocks();
  });

  describe('GET /classes', () => {
    it('should return 200', async () => {
      const res = await request(server).get('/api/classes');
      expect(res.status).toBe(200);
    });
    it('should return 3 total classes for all', async () => {
      const res = await request(server).get('/api/classes?start=all');
      expect(res.body.length).toBe(3);
    });
    it('should return 2 future classes', async () => {
      const res = await request(server).get('/api/classes');
      expect(res.body.length).toBe(2);
    });
    it('should return no classes with type purple', async () => {
      const res = await request(server).get('/api/classes?type=purple');
      expect(res.body.length).toBe(0);
    });
    it('should return 2 classes with type yoga', async () => {
      const res = await request(server).get('/api/classes?type=yoga&start=all');
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /classes/:id', () => {
    it('should return 200 when class found', async () => {
      const id = '2';
      const res = await request(server).get(`/api/classes/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Yoga 60 Beginners');
    });

    it('should return 404 when no user found', async () => {
      const id = '43';
      const res = await request(server).get(`/api/classes/${id}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe(`Class ${id} not found.`);
    });
  });
});
