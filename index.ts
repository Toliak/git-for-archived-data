#!/usr/bin/env node

import { parseArguments } from './src/cli/index.js';

parseArguments(process.argv[1] ?? '', process.argv.slice(2))
    .then()
    .catch(e => console.error('Unhandled error', e));
