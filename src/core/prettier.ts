import * as prettier from 'prettier';
import fs from 'fs';
import glob from 'glob';
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
    const result = await prettier.format(source, {
        ...options,
        filepath: fullPath,
    });
    fs.writeFileSync(fullPath, result, { encoding: 'utf8' });
}

export async function formatRawData(
    directoryPath: string,
    prettierConfigPath: string,
): Promise<void> {
    const options = await prettier.resolveConfig(prettierConfigPath);
    if (!options) {
        console.error(
            '\x1b[31m⛊\x1b[0m ' +
                ' Cannot find prettier config file' +
                '(Check .prettierrc.json file in the root of the project)',
        );
        throw new PrettierError();
    }

    const fullPath = path.resolve(directoryPath);
    if (!fs.lstatSync(fullPath).isDirectory()) {
        console.log(
            `\x1b[32m♦\x1b[0m ` +
                `Prettier applied to the file \x1b[34m${directoryPath}\x1b[0m`,
        );
        return formatRawDataFile(fullPath, options);
    }

    const promises: Promise<void>[] = [];

    for (const filePath of glob.sync('**', {
        cwd: directoryPath,
    })) {
        const fullFilePath = path.join(directoryPath, filePath);
        if (fs.lstatSync(fullFilePath).isDirectory()) {
            continue;
        }

        promises.push(formatRawDataFile(fullFilePath, options));
    }

    await Promise.all(promises);
    console.log(
        `\x1b[32m♦\x1b[0m ` +
            `Prettier applied to the files in \x1b[34m${directoryPath}\x1b[0m`,
    );
}
