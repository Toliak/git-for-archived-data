import JSON5 from 'json5';
import { Validator, ValidatorResult } from 'jsonschema';
import * as ConfigTypes from './types.js';
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

export function readConfig(filepath: string): ConfigTypes.GitForArchivedData {
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

export function mapConfigToPromises(
    config: ConfigTypes.GitForArchivedData,
    callback: (item: ConfigTypes.Item) => Promise<void>,
): Promise<void>[] {
    const promises: Promise<void>[] = [];
    for (const item of config.items) {
        promises.push(callback(item));
    }

    return promises;
}

export function configItemToString(item: ConfigTypes.Item): string {
    const withWatcher = item.archive.watching ? ' (+watching)' : '';
    const withPrettier = item.raw.applyPrettier ? '(+prettier)' : '';

    return (
        `Archive : "${item.archive.path}" (format: ${item.archive.format}) ${withWatcher}\n` +
        `Raw     : "${item.raw.path}" ${withPrettier}`
    );
}

export function configToString(config: ConfigTypes.GitForArchivedData): string {
    const itemsAmount = config.items.length;
    const configString = `Config: (${itemsAmount} items)`;

    const itemsString = config.items.map(configItemToString).join('\n');

    return `${configString}\n${itemsString}`;
}
