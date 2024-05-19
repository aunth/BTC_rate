import { connectToDatabase } from './db_handler.js';
import fs from 'fs';

async function runMigrations() {
    try {
        await connectToDatabase();

        const migrationFiles = fs.readdirSync('./migrations').sort();

        for (const file of migrationFiles) {
            const migration = await import(`./migrations/${file}`);
            await migration.up();
            console.log(`Migration applied: ${file}`);
        }

        console.log('All migrations applied successfully.');
    } catch (error) {
        console.error('Error applying migrations:', error);
    }
}

runMigrations();
