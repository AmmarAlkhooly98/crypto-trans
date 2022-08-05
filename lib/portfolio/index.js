import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import moment from 'moment';
import { fileURLToPath } from 'url';
import { startSpinner } from '../../utils/spinner.js';

const calcTokenAmount = (tokenAmountObj, trans) => {
	const [timestamp, trans_type, symbol, amount] = trans;
	if (trans_type === 'DEPOSIT') {
		return (tokenAmountObj[symbol] || 0) + parseFloat(amount);
	} else {
		return tokenAmountObj[symbol] > amount
			? (tokenAmountObj[symbol] || 0) - parseFloat(amount)
			: parseFloat(amount) - (tokenAmountObj[symbol] || 0);
	}
};

const updateTokenAmountObj = async (tokenAmountObj, transaction) => {
	const [timestamp, trans_type, symbol, amount] = transaction;

	let calcRes = await calcTokenAmount(tokenAmountObj, transaction);
	tokenAmountObj[symbol] = calcRes;

	return tokenAmountObj;
};

export const readCsvTransStream = (token, date) => {
	startSpinner('loading query data...\n\n');
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
			.pipe(parse({ delimiter: ',', from_line: 2 }))
			.on('data', async data => {
				const [timestamp, trans_type, symbol, amount] = data;

				if (!token && !date) {
					tokensFinalObj = await updateTokenAmountObj(
						tokenAmountObj,
						data,
						undefined,
						undefined
					);
				} else if (!token && date) {
					if (
						moment
							.unix(timestamp)
							.format('DD-MM-YYYY')
							.toString() === date
					) {
						tokensFinalObj = await updateTokenAmountObj(
							tokenAmountObj,
							data,
							undefined,
							date
						);
					}
				} else if (token && !date) {
					if (symbol === token)
						tokensFinalObj = await updateTokenAmountObj(
							tokenAmountObj,
							data,
							token,
							undefined
						);
				} else if (token && date) {
					if (
						moment.unix(timestamp).format('DD-MM-YYYY') === date &&
						token === symbol
					) {
						tokensFinalObj = await updateTokenAmountObj(
							tokenAmountObj,
							data,
							token,
							date
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
