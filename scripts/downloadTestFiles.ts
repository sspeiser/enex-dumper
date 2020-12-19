#!/usr/bin/env node

import fs = require('fs');
import https = require('https');

const testFiles =
    ['https://file-examples-com.github.io/uploads/2017/02/file_example_XLS_10.xls',
        'https://file-examples-com.github.io/uploads/2020/03/file_example_SVG_20kB.svg',
        'https://file-examples-com.github.io/uploads/2017/10/file-example_PDF_500_kB.pdf',
        'https://file-examples-com.github.io/uploads/2017/10/file_example_GIF_500kB.gif'].concat(
            process.env["TEST_LARGE_FILES"] === "no" ? [] : [
                'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3',
                'https://file-examples-com.github.io/uploads/2017/10/file_example_PNG_2100kB.png',
                'https://file-examples-com.github.io/uploads/2017/02/zip_10MB.zip',
                'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4']);


export default async function downloadTestFiles(): Promise<void> {
    const promises: Promise<void>[] = [];
    if (!fs.existsSync('testdata/data')) {
        fs.mkdirSync('testdata/data', { recursive: true });
    }

    for (const testFile of testFiles) {
        console.log('Downloading ' + testFile);
        const filename = testFile.split('/').pop();
        const path = 'testdata/data/' + filename;
        if (!fs.existsSync(path)) {
            promises.push(new Promise<void>((resolve) => {
                const file = fs.createWriteStream(path);
                https.get(testFile, (response) => {
                    response.pipe(file);
                }).on('close', () => {
                    console.log('Download finished: ' + testFile);
                    file.close();
                    resolve();
                }).on('error', (error) => {
                    console.log(`Download failed for ${testFile}: ${error}`);
                    resolve();
                })
            }));
        }
    }
    console.log('Downloading ...');
    await Promise.all(promises).then();
    console.log('Downloading ... done');
}
// process.on('beforeExit', async () => {
//     await Promise.all(promises);
// });
