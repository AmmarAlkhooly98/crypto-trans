import ora from 'ora';

import { orange } from './colors.js';

const spinner = new ora({ text: '' });
const progressbar = new ora({ text: '', spinner: 'material' });

export const startSpinner = txt =>
	`${spinner.start(`${orange(txt)}`)}${progressbar.start()}`;

export const stopSpinner = () => {
	spinner.stop();
	progressbar.stop();
};
