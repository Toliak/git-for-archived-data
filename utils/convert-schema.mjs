// eslint-disable-next-line @typescript-eslint/no-var-requires

import * as schemaConverter from 'json-schema-to-typescript';
import * as fs from 'fs';

// compile from file
schemaConverter
    .compileFromFile('git-for-archived-data.schema.json')
    .then(ts => fs.writeFileSync('src/config/types.ts', ts));
