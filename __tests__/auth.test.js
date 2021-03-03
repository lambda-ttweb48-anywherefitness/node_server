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
// jest.mock('../api/middleware/auth', () => jest.fn((req, res, next) => next()));

describe('auth router endpoints', () => {
  beforeAll(() => {
    //jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should return 200 when registration is successful', async () => {
      const profile = {
        name: 'Louie Smith',
        email: 'louie@example.com',
        password: 'foobar',
        instructor: true,
      };
      const res = await request(server).post('/register').send(profile);
      expect(res.status).toBe(201);
      expect(res.body.Profile.name).toBe('Louie Smith');
    });
  });

  describe('POST /login', () => {
    it('should return 200 when logging in successfully', async () => {
      const login = {
        email: 'louie@example.com',
        password: 'foobar',
      };
      const res = await request(server).post(`/login`).send(login);
      expect(res.status).toBe(200);
      expect(res.body.Profile.email).toBe(login.email);
      expect(res.body.token).toBeDefined();
    });
  });
});
