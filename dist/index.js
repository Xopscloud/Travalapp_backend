import app from '@/app.js';
import { connectToDatabase } from '@/config/db.js';
import { env } from '@/config/env.js';
import { ensureAdminExists } from '@/utils/seedAdmin.js';
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
