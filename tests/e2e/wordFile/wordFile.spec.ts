import * as path from 'path';
import { GitForArchivedData } from '../../../src/config/types';
import { readConfig } from '../../../src/config';
import { formatRawData, packArchive, unpackArchive } from '../../../src/core/';
import {
    getDefaultConfigPath,
    removeDirectoryIfExists,
    targetDirectoryFilesLengthTest,
    targetFileCheckTest,
} from '../mixins';

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

    const rawDirectoryPath = path.join(__dirname, 'SampleDocumentResult');
    const resultArchivePath = path.join(__dirname, 'SampleDocumentResult.docx');

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
            path.join(__dirname, item.archive.path),
            path.join(__dirname, item.raw.path),
        );
    });

    targetFileCheckTest(rawDirectoryPath, true);
    targetDirectoryFilesLengthTest(rawDirectoryPath, 4);

    targetFileCheckTest(path.join(rawDirectoryPath, 'word'), true);
    targetFileCheckTest(path.join(rawDirectoryPath, '_rels'), true);
    targetFileCheckTest(
        path.join(rawDirectoryPath, '[Content_Types].xml'),
        true,
    );
    targetFileCheckTest(path.join(rawDirectoryPath, 'docProps'), true);

    it('Format raw data', async () => {
        await formatRawData(
            path.join(rawDirectoryPath, 'word'),
            prettierConfigPath,
        );
        await formatRawData(
            path.join(rawDirectoryPath, '_rels'),
            prettierConfigPath,
        );
        await formatRawData(
            path.join(rawDirectoryPath, 'docProps/app.xml'),
            prettierConfigPath,
        );
        await formatRawData(
            path.join(rawDirectoryPath, 'docProps/core.xml'),
            prettierConfigPath,
        );
        await formatRawData(
            path.join(rawDirectoryPath, '[Content_Types].xml'),
            prettierConfigPath,
        );
    });

    it('Pack word file', async () => {
        expect(context.config).not.toBeNull();
        const item = context.config!.items[0]!;

        await packArchive(
            path.join(__dirname, item.raw.path),
            resultArchivePath,
            'zip',
        );
    });

    targetFileCheckTest(resultArchivePath, true);
});
