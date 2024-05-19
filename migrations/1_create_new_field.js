import { Rate } from '../db_handler.js';

export async function up() {
    try {
        await Rate.updateMany({}, { $set: { newField: 'defaultValue' } });
        console.log('Migration: Added newField to Rate collection.');
    } catch (error) {
        console.error('Error applying migration:', error);
        throw error;
    }
}

export async function down() {
    try {
        await Rate.updateMany({}, { $unset: { newField: '' } });
        console.log('Rollback: Removed newField from Rate collection.');
    } catch (error) {
        console.error('Error rolling back migration:', error);
        throw error;
    }
}
