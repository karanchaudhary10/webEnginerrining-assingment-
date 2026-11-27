import pg from 'pg';
import { config } from '../config/env.js';

const { Pool } = pg;

/** Shared connection pool — create once per process. */
export function createPool(connectionString = config.databaseUrl) {
  return new Pool({
    connectionString,
    // Fail fast in tests / bad config instead of hanging.
    connectionTimeoutMillis: 5_000,
  });
}