import app from './app';
import { connectToDatabase } from './config/db';
import { env } from './config/env';
import { ensureAdminExists } from './utils/seedAdmin';

async function start() {
  await connectToDatabase();
  await ensureAdminExists();

  app.listen(env.port, () => {
    console.log(`API server listening on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start the server', error);
  process.exit(1);
});
