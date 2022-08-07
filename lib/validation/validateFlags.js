import { warn } from '../../utils/colors.js';
import { dateRegex, tokensRegex } from './regEx.js';

export const validateToken = token => {
	token = token.toUpperCase();
	if (typeof token !== 'string') {
		console.warn(warn(`invalid token symbol data type`));
		return false;
	} else if (
		!token ||
		!token.match(tokensRegex)[0].length ||
		token.match(tokensRegex)[0] !== token
	) {
		console.log(warn(`Invlid token symbol`));
		return false;
	}

	return true;
};

export const validateDate = date => {
	if (typeof date !== 'string') {
		console.log(warn(`invalid date value type`));
		return false;
	} else if (!date || !date.match(dateRegex)) {
		console.log(
			warn(`invalid date format. The required format: YYYY-MM-DD`)
		);
		return false;
	}
	return true;
};
