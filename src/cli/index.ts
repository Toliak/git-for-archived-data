import { packArchive, unpackArchive } from '../core';
import { readConfig } from '../config';

export async function parseArguments(args: string[]): Promise<void> {
    console.log(args);
    if (args.length != 1) {
        console.error('Expected exactly one argument');
        process.exit(1);
        return;
    }

    if (args[0] == '--unpack') {
        const config = readConfig('git-for-archived-data.json');
        const promises: Promise<void>[] = [];
        for (const item of config.items) {
            promises.push(unpackArchive(item.archive.path, item.raw.path));
        }

        for (const promise of promises) {
            await promise;
        }
        return;
    }

    /**
     * Prettier is not available yet.
     * See https://github.com/prettier/plugin-xml/pull/412
     */

    if (args[0] == '--pack') {
        const config = readConfig('git-for-archived-data.json');
        const promises: Promise<void>[] = [];
        for (const item of config.items) {
            promises.push(
                packArchive(
                    item.raw.path,
                    item.archive.path,
                    item.archive.format as never,
                ),
            );
        }

        for (const promise of promises) {
            await promise;
        }
        return;
    }

    // TODO
    if (args[0] == '--watch') {
        console.error('TODO');
        process.exit(1);
        return;
    }

    console.error(`Unknown argument: ${args[0]}`);
    process.exit(1);
    return;
}
