import myCache from '../service/cache.js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import moment from 'moment';
import { fileURLToPath } from 'url';
import { stopSpinner, startSpinner } from '../../utils/spinner.js';

let cacheVal = {};
let key = '';

const calcTokenAmount = (tokenAmountObj, trans) => {
	const [timestamp, trans_type, token, amount] = trans;
	if (trans_type === 'DEPOSIT') {
		return (tokenAmountObj[token] || 0) + parseFloat(amount);
	} else {
		return tokenAmountObj[token] > amount
			? (tokenAmountObj[token] || 0) - parseFloat(amount)
			: parseFloat(amount) - (tokenAmountObj[token] || 0);
	}
};

const cachePortoflioData = async (
	tokenAmountObj,
	transaction,
	tokenInput,
	date
) => {
	const [timestamp, trans_type, token, amount] = transaction;

	const addToCahe = async key => {
		let calcRes = await calcTokenAmount(tokenAmountObj, transaction);
		tokenAmountObj[token] = calcRes;
		cacheVal = {
			...cacheVal,
			[token]: calcRes
		};
		myCache.set(key, cacheVal);
	};

	if (!tokenInput && !date) {
		key = 'tokens';
		await addToCahe(key);
	} else if (!tokenInput && date) {
		key = `date_${date}`;
		await addToCahe(key);
	} else if (tokenInput && !date) {
		key = `token_${tokenInput}`;
		await addToCahe(key);
	} else if (tokenInput && date) {
		key = `token_${tokenInput}_date_${date}`;
		await addToCahe(key);
	}
	return tokenAmountObj;
};

export const checkChache = async cacheKey => {
	if (myCache.has(cacheKey)) {
		let value = await myCache.get(cacheKey);
		return value;
	} else {
		return false;
	}
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
				if (!token && !date) {
					tokensFinalObj = cachePortoflioData(
						tokenAmountObj,
						data,
						undefined,
						undefined
					);
				} else if (!token && date) {
					const timestamp = data[0];
					if (
						moment
							.unix(timestamp)
							.format('DD-MM-YYYY')
							.toString() === date
					) {
						tokensFinalObj = cachePortoflioData(
							tokenAmountObj,
							data,
							undefined,
							date
						);
					}
				} else if (token && !date) {
					const symbol = data[2];

					if (symbol === token)
						tokensFinalObj = cachePortoflioData(
							tokenAmountObj,
							data,
							token,
							undefined
						);
				} else if (token && date) {
					const timestamp = data[0];
					const symbol = data[2];
					if (
						moment.unix(timestamp).format('DD-MM-YYYY') === date &&
						token === symbol
					) {
						tokensFinalObj = cachePortoflioData(
							tokenAmountObj,
							data,
							token,
							date
						);
					}
				}
			})
			.on('end', () => {
				stopSpinner();
				return resolve(tokensFinalObj);
			})
			.on('error', err => {
				reject(err);
			});
	});
};
