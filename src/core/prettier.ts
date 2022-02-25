import * as prettier from 'prettier';
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

class PrettierError extends Error {}

async function formatRawDataFile(
    fullPath: string,
    options: prettier.Options,
): Promise<void> {
    const info = await prettier.getFileInfo(fullPath, {
        resolveConfig: true,
    });
    if (info.ignored) {
        console.log(`Skipping ignored ${fullPath}`);
        return;
    }
    if (!info.inferredParser) {
        console.log(`No parser found for ${fullPath}`);
        return;
    }

    const source = fs.readFileSync(fullPath, { encoding: 'utf8' });
    const result = prettier.format(source, {
        ...options,
        filepath: fullPath,
    });
    fs.writeFileSync(fullPath, result, { encoding: 'utf8' });
    console.log(`Prettified file ${fullPath}`);
}

export async function formatRawData(
    directoryPath: string,
    prettierConfigPath: string,
): Promise<void> {
    const options = await prettier.resolveConfig(prettierConfigPath);
    if (!options) {
        console.error(
            'Cannot find prettier config file' +
                '(Check .prettierrc.json file in the root of the project)',
        );
        throw new PrettierError();
    }

    const fullPath = path.resolve(directoryPath);
    if (!fs.lstatSync(fullPath).isDirectory()) {
        return formatRawDataFile(fullPath, options);
    }

    const promises: Promise<void>[] = [];

    for (const filePath of glob.sync('**', {
        cwd: directoryPath,
    })) {
        if (fs.lstatSync(fullPath).isDirectory()) {
            continue;
        }

        promises.push(formatRawDataFile(filePath, options));
    }

    for (const promise of promises) {
        await promise;
    }
}
