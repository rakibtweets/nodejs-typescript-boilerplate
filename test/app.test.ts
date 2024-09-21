import request from 'supertest';
import { createExpressApp } from '../src/server';
import { Express } from 'express';

let app: Express | null = null;

beforeAll(async () => {
  app = createExpressApp() as Express;
});

afterAll(() => {
  app = null;
});

describe('App', () => {
  describe('API routes setup completed and running', () => {
    // Test unknown endpoints should return 404
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app!).get('/unknown');
      expect(response.status).toBe(404);
      expect(response.error).not.toBeNull();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(response.error.text).toBe('Not Found');
    });

    // Test default or root path should return 404
    it('should return 404 for default or root path', async () => {
      const response = await request(app!).get('/');
      expect(response.status).toBe(404);
      expect(response.error).not.toBe(false);
    });

    // Test health endpoint (/health) should return 200
    it('should return 200 for health endpoint', async () => {
      const response = await request(app!).get('/health');
      expect(response.status).toBe(200);
      expect(response.text).toBe('OK');
      expect(response.error).toBe(false);
    });
  });
});
