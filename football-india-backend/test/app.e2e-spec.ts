import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';

describe('application security and readiness', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });
  afterAll(() => app.close());

  it('reports health without authentication', async () => {
    const response = await request(app.getHttpServer()).get('/api/health').expect(200);
    expect(response.body.status).toBe('ok');
  });
  it('rejects protected endpoints without a bearer token', () => request(app.getHttpServer()).get('/api/cart').expect(401));
  it('validates registration input before contacting auth', () => request(app.getHttpServer()).post('/api/auth/register').send({ email: 'bad', password: 'short', fullName: '' }).expect(400));
  it('rejects unexpected registration fields', () => request(app.getHttpServer()).post('/api/auth/register').send({ email: 'test@example.com', password: 'long-enough-password', fullName: 'Test', role: 'admin' }).expect(400));
});
