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

const promises: Promise<void>[] = [];
if (!fs.existsSync('testdata/data/lock')) {
    fs.mkdirSync('testdata/data', { recursive: true });
}

for (const testFile of testFiles) {
    console.log('Downloading ' + testFile);
    const filename = testFile.split('/').pop();
    const path = 'testdata/data/' + filename;
    if (!fs.existsSync(path)) {
        promises.push(new Promise<void>((resolve) => {
            const file = fs.createWriteStream(path);
            // const fd = fs.openSync(path, 'w');
            https.get(testFile, (response) => {
                response.pipe(file);
                // response.on('data', (data) => {
                //     // file.write(data);
                //     fs.writeSync(fd, data);
                // });
                // response.on('close', () => {
                //     //file.close();
                //     fs.closeSync(fd);
                // }).on('error', (error) => {
                //     console.log(`Download failed for ${testFile}: ${error}`);
                //     throw new Error(`${error}`);
                // });
            }).on('end', () => {
                file.close();
                resolve();
            }).on('error', (error) => {
                console.log(`Download failed for ${testFile}: ${error}`);
                resolve();
            })
        }));
    }
}

process.on('beforeExit', async () => {
    await Promise.all(promises);
});
