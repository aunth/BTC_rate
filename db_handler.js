import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();



export async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection error:", err);
        throw err;
    }
}


export async function getPriceFromDB() {
	try {
		const latestRate = await Rate.findOne();
		if (latestRate) {
			return latestRate.rate;
		} else {
			return null;
		}
	} catch (error) {
		console.error('Помилка при отриманні курсу з бази даних:', error);
		return null;
	}
}

const rateSchema = new mongoose.Schema({
	currencyPair: String,
	rate: Number,
	date: { type: Date, default: Date.now }
});

const emailSchema = new mongoose.Schema({
	email: String,
});

export const Rate = mongoose.model('Rate', rateSchema);
export const Subscriber = mongoose.model('Subscriber', emailSchema);
