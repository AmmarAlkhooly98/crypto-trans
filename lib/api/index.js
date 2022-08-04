import axios from 'axios';

const API_URL = 'https://min-api.cryptocompare.com/data/price?tsyms=USD&fsym=';

export const fetchTokenPriceUSD = async token => {
	try {
		const res = await axios.get(`${API_URL}${token}`);
		if (res.status === 200) {
			return res.data.USD;
		}
	} catch (error) {
		console.error(error);
	}
};
