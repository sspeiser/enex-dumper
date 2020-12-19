import { parseString } from 'xml2js'
import fs = require('fs');
import { base64ToBytes } from 'byte-base64';
import { URL } from 'url';

const filename = process.argv.pop()

const content = fs.readFileSync(filename || '../testdata/data/output.enex');

console.log(filename);

let base64: string;

function extractFile(value: string, name: string) {
    console.log(name);
    if(name === 'data') {
        console.log('data: ' + value);
        base64 = value;
    }
}

function saveFile(value: string | number | Buffer | URL, name: string) {
    if(name === 'file-name' && base64) {
        fs.writeFileSync(value, base64ToBytes(base64));
    }   
}

interface attributes {
    "file-name": string;
}

interface data {
    "_": string;
}

interface resource {
    data: data[];
    "resource-attributes": attributes[];
}

interface note {
    title: string;
    resource?: resource[];
}

interface notearray {
    note: note[];
}

interface enexFile {
    "en-export": notearray; 
}


parseString(content, /* {valueProcessors: [saveFile, extractFile]}, */ (error, result) => {
    if(error) console.log(error);
    const json = result as enexFile;
    for(const note of json["en-export"]["note"]) {
        if(note["resource"]) {
            for(const resource of note["resource"]) {
                // console.log(resource['data'][0]["_"]);
                console.log(resource['resource-attributes']);
                fs.writeFileSync(resource['resource-attributes'][0]['file-name'] + '.base64', resource['data'][0]["_"]);
                //fs.writeFileSync(resource['resource-attributes'][0]['file-name'], base64ToBytes(resource['data'][0]["_"]));
            }
        }
        console.log(note["title"]);
    }
});
