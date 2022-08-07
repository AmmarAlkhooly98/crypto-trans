import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import { startSpinner } from '../../utils/spinner.js';

const calcTokenAmount = (tokenAmountObj, trans) => {
	let { timestamp, transaction_type, token: symbol, amount } = trans;
	if (transaction_type === 'DEPOSIT') {
		return (tokenAmountObj[symbol] || 0) + parseFloat(amount);
	} else {
		return tokenAmountObj[symbol] > amount
			? (tokenAmountObj[symbol] || 0) - parseFloat(amount)
			: parseFloat(amount) - (tokenAmountObj[symbol] || 0);
	}
};

const updateTokenAmountObj = async (tokenAmountObj, transaction) => {
	let { timestamp, transaction_type, token: symbol, amount } = transaction;

	let calcRes = await calcTokenAmount(tokenAmountObj, transaction);
	tokenAmountObj[symbol] = calcRes;

	return tokenAmountObj;
};
let counter = 1;

export const readCsvTransStream = (token, date) => {
	startSpinner('loading query data...\n\n');

	if (date) {
		var SECONDS_IN_DAY = 86400;
		var startOfTheDayInEpoch = new Date(date).getTime() / 1000;
		var endOfTheDayInEpoch = startOfTheDayInEpoch + SECONDS_IN_DAY;
	}
	let tokenAmountObj = {};
	let tokensFinalObj = {};
	token && (token = token.toUpperCase());
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	const rs = fs.createReadStream(path.join(__dirname, '/csv', 'test.csv'));
	// const rs = fs.createReadStream(
	// 	path.join(__dirname, '/csv', 'transactions.csv')
	// );

	return new Promise((resolve, reject) => {
		return rs
			.pipe(csv())
			.on('data', async data => {
				let { timestamp, token: symbol } = data;

				if (!token && !date) {
					tokensFinalObj = await updateTokenAmountObj(
						tokenAmountObj,
						data
					);
				} else if (!token && date) {
					if (timestamp <= endOfTheDayInEpoch) {
						tokensFinalObj = await updateTokenAmountObj(
							tokenAmountObj,
							data
						);
					}
				} else if (token && !date) {
					if (symbol === token)
						tokensFinalObj = await updateTokenAmountObj(
							tokenAmountObj,
							data
						);
				} else if (token && date) {
					if (timestamp <= endOfTheDayInEpoch && token === symbol) {
						tokensFinalObj = await updateTokenAmountObj(
							tokenAmountObj,
							data
						);
					}
				}
			})
			.on('end', () => {
				return resolve(tokensFinalObj);
			})
			.on('error', err => {
				reject(err);
			});
	});
};
