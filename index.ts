import * as unzip from 'unzipper';
import * as fs from 'fs';
import archiver from 'archiver';

let PATH = 'out/testing.pptx';
let OUT_PATH = 'out/testing_result.pptx'
let OUT_DIR = 'out/testing';

async function unpack_office_file(): Promise<void> {
    const pipe = fs.createReadStream(PATH)

    return new Promise<void>(function (resolve, reject) {
        const unzipPipe = pipe.pipe(
            unzip.Extract({path: OUT_DIR}),
        );
        unzipPipe.on('error', err => {
            console.error(
                '\x1b[31m⛊\x1b[0m ' +
                '\x1b[31mError happen while unzipping\x1b[0m',
            );
            reject(err);
        });
        unzipPipe.on('close', () => {
            console.log('\x1b[32m♦\x1b[0m Download complete\x1b[0m');
            resolve();
        });
    });
}

async function pack_office_file(): Promise<void> {
    const archive = archiver('zip', {zlib: {level: 9}});
    const stream = fs.createWriteStream(OUT_PATH);

    return new Promise((resolve, reject) => {
        archive
            .directory(OUT_DIR, false)
            .on('error', err => reject(err))
            .pipe(stream)
        ;

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

pack_office_file().then(c => console.log(c));
