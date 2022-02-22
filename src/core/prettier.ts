import * as prettier from 'prettier';
import fs from 'fs';


export async function formatRawData(
    directoryPath: string,
    prettierConfigPath: string,
): Promise<void> {
    const options = await prettier.resolveConfig(prettierConfigPath);
    if (!options) {
        // TODO: console log and correct exception
        throw new Error();
    }

    for (const filePath of fs.readdirSync(directoryPath)) {
        console.log(filePath);
    }
    // prettier.format(directoryPath, options);
}
