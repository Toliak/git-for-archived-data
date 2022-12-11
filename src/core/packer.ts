import fs from 'fs';
import { PullStream } from 'unzipper';
import * as unzip from 'unzipper';
import archiver, { Format } from 'archiver';

export async function unpackArchive(
    archivePath: string,
    rawPath: string,
): Promise<void> {
    const pipe = fs.createReadStream(archivePath);

    return new Promise<void>(function (resolve, reject) {
        const unzipPipe: PullStream = pipe.pipe(
            unzip.Extract({ path: rawPath }),
        );
        unzipPipe.on('error', err => {
            console.error(
                '\x1b[31m⛊\x1b[0m ' +
                    '\x1b[31mError happen while unpacking into \x1b[34m${rawPath}\x1b[0m',
            );
            reject(err);
        });

        unzipPipe.on('close', () => {
            console.log(
                `\x1b[32m♦\x1b[0m Unpacking into \x1b[34m${rawPath}\x1b[0m complete\x1b[0m`,
            );
            resolve();
        });
    });
}

export async function packArchive(
    rawPath: string,
    archivePath: string,
    format: Format,
): Promise<void> {
    if (!fs.existsSync(rawPath)) {
        console.error('No raw path error');
        return;
    }

    const archive = archiver(format, { zlib: { level: 9 } });
    const stream = fs.createWriteStream(archivePath);

    return new Promise((resolve, reject) => {
        archive
            .directory(rawPath, false)
            .on('error', err => reject(err))
            .pipe(stream);

        stream.on('close', () => resolve());
        archive.finalize();
    });
}
