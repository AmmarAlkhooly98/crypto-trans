#!/usr/bin/env node

/**
 * crypto-trans
 * CLI program to help crypto investors query their portfolio data from csv file
 * @author ammar-alkhooly <https://www.linkedin.com/in/ammar-alkhooly/>
 */

import init from './utils/init.js';
import cli from './utils/cli.js';
import log from './utils/log.js';
import { checkCmnd } from './lib/index.js';

const input = cli.input;
const flags = cli.flags;
const { noClear, debug } = flags;

(async () => {
	// Init and help.
	init({ noClear });
	(input.includes(`help`) || !input) && cli.showHelp(0);

	// Main cli program logic
	checkCmnd(flags);

	// Debug info if needed
	debug && log(flags);
})();
