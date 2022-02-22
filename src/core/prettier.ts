import * as prettier from 'prettier';
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

class PrettierError extends Error {}

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

    for (const filePath of glob.sync('**', {
        cwd: directoryPath,
    })) {
        const fullPath = path.join(directoryPath, filePath);
        if (fs.lstatSync(fullPath).isDirectory()) {
            continue;
        }

        const info = await prettier.getFileInfo(fullPath, {
            resolveConfig: true,
        });
        if (info.ignored) {
            console.log(`Skipping ignored ${fullPath}`);
            continue;
        }
        if (!info.inferredParser) {
            console.log(`No parser found for ${fullPath}`);
            continue;
        }

        const source = fs.readFileSync(fullPath, { encoding: 'utf8' });
        const result = prettier.format(source, {
            ...options,
            filepath: fullPath,
        });
        fs.writeFileSync(fullPath, result, { encoding: 'utf8' });
        console.log(`Prettified file ${fullPath}`);
    }
}
