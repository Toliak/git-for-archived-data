import {
    createWatcher,
    formatRawData,
    packArchive,
    unpackArchive,
} from '../core';
import { readConfig } from '../config';
import inquirer from 'inquirer';

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
            promises.push(
                (async () => {
                    await unpackArchive(item.archive.path, item.raw.path);
                    console.log('asdasd', item.raw.applyPrettier);
                    if (item.raw.applyPrettier) {
                        await formatRawData(item.raw.path, '.');
                    } else {
                        console.log('Skipped prettier');
                    }
                })(),
            );
        }

        for (const promise of promises) {
            await promise;
        }
        return;
    }

    if (args[0] == '--pack') {
        const questions = [
            {
                type: 'boolean',
                name: 'confirm',
                message: 'Confirm? [y/n]',
            },
        ];

        const data = (await inquirer.prompt(questions)) as {
            confirm: boolean;
        };

        if (!data.confirm) {
            console.error('No confirm. Exiting');
            process.exit(1);
        }

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

    if (args[0] == '--watch') {
        const config = readConfig('git-for-archived-data.json');
        createWatcher(config);
        return;
    }

    console.error(`Unknown argument: ${args[0]}`);
    process.exit(1);
    return;
}
