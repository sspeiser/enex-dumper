#!/usr/bin/env node

import fs = require('fs');
import https = require('https');

const testFiles = process.env["TEST_LARGE_FILES"] === "no" ?
    ['https://sample-videos.com/gif/1.gif',
        'https://sample-videos.com/svg/2.svg',
        'https://sample-videos.com/ppt/Sample-PPT-File-500kb.ppt']
    :
    ['https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_10mb.mp4',
        'https://sample-videos.com/img/Sample-jpg-image-1mb.jpg',
        'https://sample-videos.com/img/Sample-png-image-500kb.png',
        'https://sample-videos.com/gif/1.gif',
        'https://sample-videos.com/svg/2.svg',
        'https://sample-videos.com/xls/Sample-Spreadsheet-5000-rows.xls',
        'https://sample-videos.com/pdf/Sample-pdf-5mb.pdf',
        'https://sample-videos.com/ppt/Sample-PPT-File-500kb.ppt',
        'https://sample-videos.com/zip/20mb.zip'
    ];



const promises: Promise<void>[] = [];
if(!fs.existsSync('testdata/data/lock')) {
    fs.mkdirSync('testdata/data', { recursive: true });
}
for (const testFile of testFiles) {
    console.log('Downloading ' + testFile);
    const filename = testFile.split('/').pop();
    const path = 'testdata/data/' + filename;
    if (!fs.existsSync(path)) {
        promises.push(new Promise<void>((resolve) => {
            // const file = fs.createWriteStream(path);
            const fd = fs.openSync(path, 'w');
            https.get(testFile, (response) => {
                response.on('data', (data) => {
                    // file.write(data);
                    fs.writeSync(fd, data);
                });
                response.on('close', () => {
                    //file.close();
                    fs.closeSync(fd);
                }).on('error', (error) => {
                    console.log(`Download failed for ${testFile}: ${error}`);
                    throw new Error(`${error}`);
                });
            }).on('end', () => resolve()).on('error', (error) => {
                console.log(`Download failed for ${testFile}: ${error}`);
                throw new Error(`${error}`);
            })
        }));
    }
}

process.on('beforeExit',async () => {
    await Promise.all(promises);
});
