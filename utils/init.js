import welcome from 'cli-welcome';
import { readFile } from 'fs/promises';
import unhandled from 'cli-handle-unhandled';
import figlet from 'figlet';
const pkg = JSON.parse(
	await readFile(new URL('./../package.json', import.meta.url))
);

export default ({ clear = false }) => {
	unhandled();
	welcome({
		title: `crypto-trans`,
		tagLine: `by ammar-alkhooly`,
		description: `${pkg.description}\n${figlet.textSync(
			'Crypto Portfolio CLI'
		)}`,
		version: pkg.version,
		bgColor: '#36BB09',
		color: '#000000',
		bold: true,
		clear
	});
};
