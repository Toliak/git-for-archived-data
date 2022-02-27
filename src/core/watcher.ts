import chokidar from 'chokidar';
import { GitForArchivedData, Item as ConfigItem } from '../config/types';
import { unpackArchive } from './packer';
import { formatRawData } from './prettier';

interface WatcherContext {
    lastBuildTime: number;
}

const WATCHER_COOLDOWN = 1;

async function listenerTemplate(
    path: string,
    context: WatcherContext,
    mapping: Readonly<Record<string, ConfigItem>>,
): Promise<void> {
    // If current datetime - lastBuild datetime < DELTA => do not build again!
    console.log(
        `> Updated \x1b[34m${path}\x1b[0m ` +
            `\x1b[35m${new Date().toISOString()}\x1b[0m`,
    );
    const currentTimestamp = new Date().getTime();
    if (currentTimestamp - context.lastBuildTime < WATCHER_COOLDOWN) {
        console.log(`> Build \x1b[31mskipped due to cooldown\x1b[0m`);
        return;
    }

    const config = mapping[path];
    if (!config) {
        console.log(
            `> Error \x1b[34m${path}\x1b[0m ` +
                `\x1b[35m${new Date().toISOString()}\x1b[0m`,
        );
        return;
    }
    await unpackArchive(config.raw.path, config.archive.path);
    if (config.raw.applyPrettier) {
        await formatRawData(config.raw.path, '.prettierrc.json');
    }

    context.lastBuildTime = new Date().getTime();
}

export default function (
    config: Readonly<GitForArchivedData>,
): chokidar.FSWatcher {
    console.log('> Watcher \x1b[32mstarted\x1b[0m');

    const context: WatcherContext = {
        lastBuildTime: 0,
    };

    const archivesMap = Object.fromEntries(
        config.items
            .filter(v => v.archive.watching)
            .map(v => [v.archive.path, v]),
    );

    const eventClosure: (path: string) => void = p =>
        listenerTemplate(p, context, archivesMap);
    return chokidar
        .watch(Object.keys(archivesMap), {
            ignoreInitial: true,
        })
        .on('add', eventClosure)
        .on('change', eventClosure);
}
