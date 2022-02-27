#!/usr/bin/env node

import { parseArguments } from './src/cli';

parseArguments(process.argv.slice(2))
    .then()
    .catch(e => console.error('Unhandled error', e));
