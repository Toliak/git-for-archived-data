import * as JSON5 from 'json5';
import { Validator, ValidatorResult } from 'jsonschema';
import { GitForArchivedData } from './types';
import path from 'path';
import * as fs from 'fs';

class ConfigReaderError extends Error {}

export function validateConfig(data: unknown): ValidatorResult {
    const schemaPath = path.resolve(
        __dirname,
        '../../git-for-archived-data.schema.json',
    );
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON5.parse(schemaContent);

    const validator = new Validator();
    return validator.validate(data, schema, {
        throwError: false,
    });
}

export function readConfig(filepath: string): GitForArchivedData {
    const content = fs.readFileSync(filepath, 'utf8');
    const metaArray = JSON5.parse(content);

    for (let i = 0; i < metaArray.length; ++i) {
        const meta = metaArray[i];

        const validationResult = validateConfig(meta);
        if (validationResult.errors.length > 0) {
            console.log(
                `Error happen while validating "${filepath}". In part: ${i}`,
            );
            throw new ConfigReaderError(validationResult.toString());
        }
    }

    return metaArray;
}
