import chalk from 'chalk';
import ora from 'ora';
const yellow = chalk.hex('#FFFF00.'); // bright yellow color

const spinner = new ora({ text: '' });
const dots = new ora({ text: '', spinner: 'material' });

export const startSpinner = txt =>
	`${spinner.start(`${yellow(txt)}`)}${dots.start()}`;

export const stopSpinner = () => {
	spinner.stop();
	dots.stop();
};
