import express from 'express';
import axios from 'axios';
import { connectToDatabase, Rate, Subscriber, getPriceFromDB } from './db_handler.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cron from 'node-cron';
dotenv.config();


const app = express();
app.use(express.json());


await connectToDatabase().catch(err => console.error(err));

async function getBitcoinToUahRate() {
	try {
		const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUAH');
		const bitcoinToUahRate = parseFloat(response.data.price);
		return bitcoinToUahRate;
	} catch (error) {
		console.error('Помилка при отриманні курсу Bitcoin до UAH:', error);
		return null;
	}
}

async function updatePrice(newRate) {
	try {
		const existingRate = await Rate.findOne();

		if (!existingRate || existingRate.rate !== newRate) {
			if (existingRate) {
				existingRate.rate = newRate;
				await existingRate.save();
			} else {
				const rate = new Rate({ rate: newRate });
				await rate.save();
			}
			console.log('Курс збережено в базі даних:', newRate);
			return newRate;
		} else {
			console.log('Курс вже збережений в базі даних та співпадає з поточним:', newRate);
			return newRate;
		}
	} catch (error) {
		console.error('Помилка при збереженні курсу в базу даних:', error);
		return null;
	}
}

app.get('/rate', async (req, res) => {
	const btcRate = await getBitcoinToUahRate();
	if (btcRate !== null) {
		res.send({ result: btcRate });
		await updatePrice(btcRate);
	} else {
		res.status(400).send({ error: 'Недійсне значення статусу' });
	}
});

app.post('/subscribe', async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).send({ error: 'Email обов’язковий' });
	}

	try {
		const newSubscriber = new Subscriber({ email });
		await newSubscriber.save();
		res.send({ message: 'Електронна пошта додана' });
	} catch (error) {
		console.error('Помилка при підписці на електронну пошту:', error);
		if (error.code === 11000) {
			res.status(409).send({ error: 'Електронна пошта вже є в базі' });
		} else {
			res.status(500).send({ error: 'Внутрішня помилка сервера' });
		}
	}
});

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: process.env.GMAIL,
	  pass: process.env.APP_PASSWORD,
	}
});


async function sendPriceEmails(rate){
	const emails = await Subscriber.find();
	if (!emails.length) {
	  console.log('Немає підписників для відправки електронної пошти');
	  return;
	}
  
	for (const email of emails) {
		const mailOptions = {
			from: process.env.GMAIL,
			to: email.email,
			subject: 'Поточний курс Bitcoin до UAH',
			text: `Поточний курс Bitcoin до UAH становить ${rate}`
		};
	
		try {
			await transporter.sendMail(mailOptions);
			console.log('Електронний лист успішно відправлено:', email.email);
		} catch (error) {
			console.error('Помилка при відправці електронної пошти:', error);
		}
	}
};

cron.schedule('0 10 * * *', async () => {
	const rate = await getBitcoinToUahRate();
	if (rate !== null) {
	  await sendPriceEmails(rate);
	  console.log('Щоденне завдання виконано: оновлено ціну BTC і відправлено електронні листи.');
	}
});

app.post('/send-price', async (req, res) => {
	const rate = await getPriceFromDB();

	await sendPriceEmails(rate);
	res.status(200).send({message: "Електронні листи відправлено"})
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
