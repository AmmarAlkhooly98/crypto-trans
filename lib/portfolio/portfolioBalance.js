import Table from 'cli-table3';

import { green, blue } from '../../utils/colors.js';
import { stopSpinner } from '../../utils/spinner.js';
import { fetchTokenPriceUSD } from '../api/index.js';

export const portfolioBalanceSummary = async tokensObj => {
	let totalPortfolioBal = 0;
	let tokensSummaryTable = new Table({
		head: [
			'Token',
			'Token Price (USD)',
			'Equity value',
			`Equity value (USD)`
		]
	});
	let portfolioValTable = new Table();

	for (let token in tokensObj) {
		const totalAmountOfToken = tokensObj[token];
		const currentValueOfToken = await fetchTokenPriceUSD(token);
		const valueOfTokenInPortfolio =
			currentValueOfToken * totalAmountOfToken;

		tokensSummaryTable.push({
			[token]: [
				`${green('$')}${currentValueOfToken
					.toFixed(2)
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
				totalAmountOfToken.toFixed(5),
				`${green('$')}${valueOfTokenInPortfolio
					.toFixed(2)
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
			]
		});
		totalPortfolioBal += valueOfTokenInPortfolio;
	}
	portfolioValTable.push({
		[blue('Total balance (USD)')]: `${green('$')}${totalPortfolioBal
			.toFixed(2)
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
	});

	stopSpinner();

	console.log(tokensSummaryTable.toString());
	console.log(portfolioValTable.toString());
	return totalPortfolioBal;
};
