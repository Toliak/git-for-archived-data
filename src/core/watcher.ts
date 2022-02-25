// import chokidar from 'chokidar';
//
// interface WatcherContext {
//     lastBuildTime: number;
// }
//
// function listenerTemplate(
//     path: string,
//     callback: () => void,
//     context: WatcherContext,
// ) {
//     // If current datetime - lastBuild datetime < DELTA => do not build again!
//     console.log(
//         `> Updated \x1b[34m${path}\x1b[0m ` +
//         `\x1b[35m${new Date().toISOString()}\x1b[0m`,
//     );
//     const currentTimestamp = new Date().getTime();
//     if (currentTimestamp - context.lastBuildTime < config.coolDownMs) {
//         console.log(`> Build \x1b[31mskipped due to cooldown\x1b[0m`);
//         return;
//     }
//
//     callback();
//     context.lastBuildTime = new Date().getTime();
// }
//
// export default function (
//     callback: () => void,
// ): chokidar.FSWatcher {
//     console.log('> Watcher \x1b[32mstarted\x1b[0m');
//
//     const context: WatcherContext = {
//         lastBuildTime: 0,
//     };
//
//     const eventClosure: (path: string) => void = p =>
//         listenerTemplate(p, callback, context, config);
//     return chokidar
//         .watch('tex/**', {
//             ignoreInitial: true,
//         })
//         .on('add', eventClosure)
//         .on('change', eventClosure);
// }
