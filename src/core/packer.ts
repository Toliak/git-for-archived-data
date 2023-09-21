import fs from 'fs';
import AdmZip from 'adm-zip';
import archiver, { Format } from 'archiver';

export async function unpackArchive(
    archivePath: string,
    rawPath: string,
): Promise<void> {
    const zip = new AdmZip(archivePath);

    return new Promise<void>(function (resolve, reject) {
        zip.extractAllToAsync(rawPath, true, false, error => {
            if (error !== undefined) {
                console.error(
                    '\x1b[31m⛊\x1b[0m ' +
                        `\x1b[31mError happen while unpacking into \x1b[34m${rawPath}\x1b[0m`,
                );
                reject(error);
                return;
            }

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
