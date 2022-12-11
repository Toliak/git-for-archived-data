import path from 'path';
import * as fs from 'fs';

export function getDefaultConfigPath(directory: string) {
    return path.join(directory, 'git-for-archived-data.json');
}

export function targetFileCheckTest(
    filepath: string,
    isExists?: boolean,
    saveSnapshot?: boolean,
): void {
    it(
        `The target file "${filepath}" ` +
            `${isExists ? 'exists' : 'does not exist'}`,
        async () => {
            const result = fs.existsSync(filepath);
            if (isExists) {
                expect(result).toBeTruthy();

                if (saveSnapshot && !fs.lstatSync(filepath).isDirectory()) {
                    expect(fs.readFileSync(filepath, 'utf8')).toMatchSnapshot();
                }
            } else {
                expect(result).toBeFalsy();
            }
        },
    );
}

export function targetDirectoryFilesLengthTest(
    filepath: string,
    length: number,
): void {
    it(
        `The target directory "${filepath}"` + `contains ${length} files`,
        async () => {
            expect(fs.readdirSync(filepath)).toHaveLength(length);
        },
    );
}

export function removeDirectoryIfExists(dirpath: string) {
    if (fs.existsSync(dirpath)) {
        fs.rmSync(dirpath, { recursive: true });
    }
}
