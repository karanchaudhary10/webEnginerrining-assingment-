import request from 'supertest';
import { afterAll } from 'vitest';
import { createApp } from '../src/app.js';
import { createContainer } from '../src/container.js';
import { resetTestDb } from './setup/postgres.js';

// Fast fake password hashing so tests don't spend ~50 ms per scrypt call.
export const fakeHash = async (plain) => `fake:${plain}`;
export const fakeVerify = async (plain, stored) => stored === `fake:${plain}`;

let testPoolPromise;

afterAll(async () => {
  if (testPoolPromise) {
    await (await testPoolPromise).end();
    testPoolPromise = undefined;
  }
});

export const ADMIN = { firstName: 'Aarav', lastName: 'Sharma', email: 'admin@example.com', password: 'Admin12345' };
export const SITA = { firstName: 'Sita', lastName: 'Gurung', email: 'sita@example.com', password: 'Secret123' };
export const RAM = { firstName: 'Ram', lastName: 'Thapa', email: 'ram@example.com', password: 'Secret456' };

// Each test file gets its own test pool; tests within it reuse the migrated schema.
export async function buildTestApp(overrides = {}) {
  testPoolPromise ??= resetTestDb();
  const pool = await testPoolPromise;
  await pool.query('TRUNCATE users CASCADE');

  const container = createContainer({
    hashPassword: fakeHash,
    verifyPassword: fakeVerify,
    ...overrides,
    pool,
  });
  const admin = await container.usersService.create(ADMIN, { role: 'admin' });
  return { app: createApp(container), container, admin };
}

// Register (or log in) and return { user, token, agent }. The agent keeps the refresh cookie.
export async function registerAs(app, person) {
  const agent = request.agent(app);
  const res = await agent.post('/api/v1/auth/register').send(person);
  return { user: res.body.data.user, token: res.body.data.accessToken, agent };
}

export async function loginAs(app, { email, password }) {
  const agent = request.agent(app);
  const res = await agent.post('/api/v1/auth/login').send({ email, password });
  return { user: res.body.data.user, token: res.body.data.accessToken, agent };
}

export const bearer = (token) => ({ Authorization: `Bearer ${token}` });