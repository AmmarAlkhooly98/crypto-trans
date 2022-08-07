import meow from 'meow';
import meowHelp from 'cli-meow-help';

const flags = {
	date: {
		type: `string`,
		alias: `d`,
		desc: `Transaction date value, format: YYYY-MM-DD`
	},
	token: {
		type: `string`,
		alias: `t`,
		desc: `Token symbol value, Ex: BTC`
	},
	clear: {
		type: `boolean`,
		default: true,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `debug`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	}
};

const commands = {
	help: { desc: `Print help info` },
	'--token, -t': { desc: `query portfolio by token` },
	'--date, -d': { desc: `query portfolio by date` },
	'-----------------------------------------': {
		desc: `---------------------------------------`
	},
	'EX: crypto-trans': {
		desc: `get all portfolio balances for each token`
	},
	'EX: crypto-trans -d 25-10-2019 -t ETH': {
		desc: `query portfolio by date and token`
	},
	'EX: crypto-trans -d 25-10-2019': {
		desc: `query portfolio by date`
	},
	'EX: crypto-trans -t BTC': {
		desc: `query portfolio by token`
	}
};

const helpText = meowHelp({
	name: `crypto-trans`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

export default meow(helpText, options);
