import * as path from 'path';
import { GitForArchivedData } from '../../../src/config/types.js';
import { readConfig } from '../../../src/config/index.js';
import { formatRawData, packArchive, unpackArchive } from '../../../src/core/index.js';
import {
    getDefaultConfigPath,
    removeDirectoryIfExists,
    targetDirectoryFilesLengthTest,
    targetFileCheckTest,
} from '../mixins.js';
import {fileURLToPath} from "url";

interface TestEnvContext {
    config: GitForArchivedData | null;
}

/**
 * Do not execute sub-tests separately
 */
describe('Case MS Office Word file unpack and pack', () => {
    const targetDirectory = 'tests/e2e/wordFile';
    const configPath = getDefaultConfigPath(targetDirectory);
    const prettierConfigPath = '.prettierrc.json';

    const tsDir = path.dirname(fileURLToPath(import.meta.url));

    const rawDirectoryPath = path.join(tsDir, 'SampleDocumentResult');
    const resultArchivePath = path.join(tsDir, 'SampleDocumentResult.docx');

    const context: TestEnvContext = {
        config: null,
    };

    removeDirectoryIfExists(rawDirectoryPath);

    it('ReadConfig', async () => {
        context.config = readConfig(configPath);
        expect(context.config.items).toHaveLength(1);
    });

    it('Unpack word file', async () => {
        expect(context.config).not.toBeNull();

        // eslint-disable-file @typescript-eslint/no-non-null-assertion
        const item = context.config!.items[0]!;

        await unpackArchive(
            path.join(tsDir, item.archive.path),
            path.join(tsDir, item.raw.path),
        );
    });

    targetFileCheckTest(rawDirectoryPath, true);
    targetDirectoryFilesLengthTest(rawDirectoryPath, 4);

    targetFileCheckTest(path.join(rawDirectoryPath, 'word'), true);
    targetFileCheckTest(path.join(rawDirectoryPath, '_rels'), true);
    targetFileCheckTest(path.join(rawDirectoryPath, 'docProps'), true);

    it('Format raw data', async () => {
        await formatRawData(rawDirectoryPath, prettierConfigPath);
    });

    targetFileCheckTest(
        path.join(rawDirectoryPath, 'word/_rels/document.xml.rels'),
        true,
        true,
    );
    targetFileCheckTest(
        path.join(rawDirectoryPath, 'word/document.xml'),
        true,
        true,
    );
    targetFileCheckTest(
        path.join(rawDirectoryPath, '[Content_Types].xml'),
        true,
        true,
    );

    it('Pack word file', async () => {
        expect(context.config).not.toBeNull();
        const item = context.config!.items[0]!;

        await packArchive(
            path.join(tsDir, item.raw.path),
            resultArchivePath,
            'zip',
        );
    });

    targetFileCheckTest(resultArchivePath, true);
});
