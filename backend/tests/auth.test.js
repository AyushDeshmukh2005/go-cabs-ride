
const request = require('supertest');
const { app } = require('../server');
const { pool } = require('../config/database');

// Mock the database pool and jwt
jest.mock('../config/database', () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn(() => ({
      release: jest.fn()
    }))
  },
  testConnection: jest.fn(() => Promise.resolve(true)),
  initializeDatabase: jest.fn(() => Promise.resolve(true))
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked-token'),
  verify: jest.fn((token, secret, callback) => {
    if (token === 'valid-token') {
      callback(null, { id: 1, email: 'test@example.com', role: 'rider' });
    } else {
      callback(new Error('Invalid token'));
    }
  })
}));

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          // Missing required fields
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should register a new user successfully', async () => {
      // Mock the database response
      pool.query.mockResolvedValueOnce([[]]);
      pool.query.mockResolvedValueOnce([{ insertId: 1 }]);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123',
          phone: '+12345678901',
          role: 'rider'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should return error if email already exists', async () => {
      // Mock that email already exists
      pool.query.mockResolvedValueOnce([[{ id: 1 }]]);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'Password123',
          phone: '+12345678901',
          role: 'rider'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Email already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          // Missing required fields
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return error for non-existent user', async () => {
      // Mock that user doesn't exist
      pool.query.mockResolvedValueOnce([[]]);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return error for incorrect password', async () => {
      // Mock user exists but password is wrong
      pool.query.mockResolvedValueOnce([[{
        id: 1,
        email: 'test@example.com',
        password: '$2b$10$invalidhashpassword',
        role: 'rider'
      }]]);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .get('/api/auth/verify');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token provided');
    });

    it('should return user data for valid token', async () => {
      // Mock user retrieval from database
      pool.query.mockResolvedValueOnce([[{
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'rider'
      }]]);

      const res = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer valid-token');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });
  });
});
