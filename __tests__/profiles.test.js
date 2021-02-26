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

describe('profiles router endpoints', () => {
  beforeAll(() => {
    //jest.clearAllMocks();
  });

  describe('GET /profiles', () => {
    it('should return 200', async () => {
      const res = await request(server).get('/api/profiles');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(5);
    });
  });

  describe('GET /profiles/:id', () => {
    it('should return 200 when profile found', async () => {
      const id = '00ulthapbErVUwVJy4x6';
      const res = await request(server).get(`/api/profiles/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test001 User');
    });

    it('should return 404 when no user found', async () => {
      const id = 'd376de0577681ca93614';
      const res = await request(server).get(`/api/profiles/${id}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe(`Profile ${id} not found.`);
    });
  });

  describe('PUT /profile/id', () => {
    it('should return 200 when profile is updated', async () => {
      const profile = {
        id: '00ulthapbErVUwVJy4x6',
        name: 'Louie Frank',
      };
      const res = await request(server)
        .put(`/api/profiles/${profile.id}`)
        .send(profile);
      expect(res.status).toBe(200);
      expect(res.body.Profile.name).toBe('Louie Frank');
    });
  });
});
