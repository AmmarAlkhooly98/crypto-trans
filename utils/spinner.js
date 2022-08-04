import ora from 'ora';

import { orange } from './colors.js';

const spinner = new ora({ text: '' });
const dots = new ora({ text: '', spinner: 'material' });

export const startSpinner = txt =>
	`${spinner.start(`${orange(txt)}`)}${dots.start()}`;

export const stopSpinner = () => {
	spinner.stop();
	dots.stop();
};
