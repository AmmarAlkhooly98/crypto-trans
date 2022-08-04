#!/usr/bin/env node

/**
  ____                  _
 |  _ \ _ __ ___  _ __ (_)_ __   ___
 | |_) | '__/ _ \| '_ \| | '_ \ / _ \
 |  __/| | | (_) | |_) | | | | |  __/
 |_|   |_|  \___/| .__/|_|_| |_|\___|
                 |_|

 * crypto-transactions-cli
 * CLI program to help crypto investors query their portfolio data from csv file
 * Note from me: I have enjoyed working on this Task! Thanks, I've learned a lot from this...
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
