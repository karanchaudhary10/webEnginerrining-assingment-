import { createApp } from './app.js';
import { config } from './config/env.js';
import { createContainer } from './container.js';
import { bootstrapAdmin } from './data/bootstrap-admin.js';

const container = createContainer();
await bootstrapAdmin(container.usersService, config.admin);
const app = createApp(container);

const server = app.listen(config.port, config.host, () => {
  console.log(`👤 Users API on http://${config.host}:${config.port} (${config.env}, pid ${process.pid})`);
  if (!container.githubClient.isConfigured) console.log('ℹ️  GitHub login disabled (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET not set)');
});

async function shutdown(signal) {
  console.log(`${signal} received — shutting down`);

  server.close();

  try {
    await container.pool.end();
    await container.redis.quit();
    process.exit(0);
  } catch (err) {
    console.error('Shutdown failed:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);