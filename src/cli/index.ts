import {
    createWatcher,
    formatRawData,
    packArchive,
    unpackArchive,
} from '../core/index.js';
import {
    configToString,
    mapConfigToPromises,
    readConfig,
} from '../config/index.js';

import { ArgumentParser } from 'argparse';
import { GitForArchivedData } from '../config/types.js';
import fs from 'fs';
import path from 'path';
import { askToUserConfirm } from './utils.js';
import { initializeDirectory } from './initializer.js';

const parser = new ArgumentParser({
    description: 'Git for Archived Data',
});

const enum PackerActionType {
    Pack = 'pack',
    Unpack = 'unpack',
    Watch = 'watch',
    Initialize = 'init',
}

const packerActions: PackerActionType[] = [
    PackerActionType.Pack,
    PackerActionType.Unpack,
    PackerActionType.Watch,
    PackerActionType.Initialize,
];

parser.add_argument('-a', '--action', {
    dest: 'action',
    choices: packerActions as string[],
    help: 'Archive action',
    required: true,
});

parser.add_argument('-c', '--config', {
    dest: 'config',
    default: 'git-for-archived-data.json',
    help: 'Configuration path',
    required: false,
});

interface CliArguments {
    action: PackerActionType;
    config: string;
}

type ActionFunction = (this: void, config: GitForArchivedData) => void;
const actionFunctions: Record<PackerActionType, ActionFunction> = {
    [PackerActionType.Unpack]: async config => {
        const promises = mapConfigToPromises(config, async item => {
            const archivePath = path.resolve(item.archive.path);
            const rawPath = path.resolve(item.raw.path);

            await unpackArchive(archivePath, rawPath);

            if (item.raw.applyPrettier) {
                await formatRawData(rawPath, '.');
            } else {
                console.log('Skipped prettier');
            }
        });
        return Promise.all(promises);
    },

    [PackerActionType.Pack]: async config => {
        const userConfirmation = await askToUserConfirm();
        if (!userConfirmation) {
            console.error('\x1b[31m⛊\x1b[0m Aborted');
            return;
        }

        const promises = mapConfigToPromises(config, async item => {
            await packArchive(
                item.raw.path,
                item.archive.path,
                item.archive.format as never,
            );
        });
        return Promise.all(promises);
    },

    [PackerActionType.Watch]: async config => {
        const rawPathsToWatch = config.items
            .filter(it => it.archive.watching)
            .map(it => path.resolve(it.archive.path));

        if (rawPathsToWatch.length === 0) {
            console.error('\x1b[31m⛊\x1b[0m Nothing to watch');
            return;
        }

        console.log(
            `Paths to watch: \n${rawPathsToWatch
                .map(it => `- \x1b[34m${it}\x1b[0m`)
                .join('\n')}`,
        );

        createWatcher(config);
    },

    [PackerActionType.Initialize]: async () => {
        await initializeDirectory('.');
        console.log(`\x1b[32m♦\x1b[0m ` + 'Initialized');
    },
};

// TODO: resolve paths preliminary

export async function parseArguments(args: string[]): Promise<void> {
    const parseArgs: CliArguments = parser.parse_args(args);

    const configPath = path.resolve(parseArgs.config);
    if (!fs.existsSync(configPath)) {
        console.error(`\x1b[31m⛊\x1b[0m The config "${configPath}" not found`);
        return;
    }

    if (parseArgs.action === PackerActionType.Initialize) {
        // Do not read config for initialization
        await actionFunctions[parseArgs.action](null as never);
        return;
    }

    const config = readConfig(configPath);
    console.log(configToString(config));

    const actionFunction = actionFunctions[parseArgs.action];
    if (!actionFunction) {
        console.error(`\x1b[31m⛊\x1b[0m Unknown action: "${parseArgs.action}"`);
        return;
    }

    await actionFunction(config);
    return;
}
