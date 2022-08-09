import myCache from './service/cache.js';
import { validateDate, validateToken } from './validation/validateFlags.js';
import { readCsvTransStream } from './portfolio/index.js';
import { portfolioBalanceSummary } from './portfolio/portfolioBalance.js';
import { info } from '../utils/colors.js';

export const checkCmnd = async flags => {
	const { date, token } = flags;
	const flagKeys = Object.keys(flags);

	// check if user didn't add neither the date and token flags
	if (!flagKeys.includes('token') && !flagKeys.includes('date')) {
		const key = `tokens`;
		let cacheExists = myCache.has(key)
			? await myCache.get(cacheKey)
			: false;
		if (cacheExists) {
			await portfolioBalanceSummary(cacheExists);
			return;
		} else {
			let tokenAmountObj = await readCsvTransStream(undefined, undefined);
			myCache.set(key, tokenAmountObj);
			await portfolioBalanceSummary(tokenAmountObj);
			return;
		}
	}

	// check if user added the date flag only, but without a value
	if (flagKeys.includes('date') && !flagKeys.includes('token') && !date)
		return console.log(info(`INFO: Please provide a date value`));
	else if (!token) {
		const key = `date_${flags?.date}`;

		if (validateDate(flags?.date)) {
			let cacheExists = myCache.has(key)
				? await myCache.get(cacheKey)
				: false;
			if (cacheExists) {
				await portfolioBalanceSummary(cacheExists);
				return;
			} else {
				let tokenAmountObj = await readCsvTransStream(
					undefined,
					flags?.date
				);
				myCache.set(key, tokenAmountObj);
				await portfolioBalanceSummary(tokenAmountObj);
				return;
			}
		}
		return;
	}

	// check if user added the token flag only, but without a value
	if (flagKeys.includes('token') && !flagKeys.includes('date') && !token)
		return console.log(info('INFO: Please provide a token symbol value'));
	else if (!date) {
		const key = `token_${flags?.token}`;

		if (validateToken(flags?.token)) {
			let cacheExists = myCache.has(key)
				? await myCache.get(cacheKey)
				: false;
			if (cacheExists) {
				await portfolioBalanceSummary(cacheExists);
				return;
			} else {
				let tokenAmountObj = await readCsvTransStream(
					flags?.token,
					undefined
				);
				myCache.set(key, tokenAmountObj);
				await portfolioBalanceSummary(tokenAmountObj);
				return;
			}
		}
		return;
	}

	// check if user added both the date and token flags, but without a value
	if (
		flagKeys.includes('token') &&
		flagKeys.includes('date') &&
		(!token || !date)
	)
		return console.log(
			info('INFO: Please provide a token symbol value and a date value')
		);
	else if (token && date) {
		const key = `token_${flags?.token}_date_${flags?.date}`;

		if (validateToken(flags?.token) && validateDate(flags?.date)) {
			let cacheExists = myCache.has(key)
				? await myCache.get(cacheKey)
				: false;
			if (cacheExists) {
				await portfolioBalanceSummary(cacheExists);
				return;
			} else {
				let tokenAmountObj = await readCsvTransStream(
					flags?.token,
					flags?.date
				);
				myCache.set(key, tokenAmountObj);
				await portfolioBalanceSummary(tokenAmountObj);
				return;
			}
		}
		return;
	}
};
