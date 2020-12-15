import { createResource } from './NoteSource';
import { dumpResource } from './ResourceDumper';
import { EnexDumperOptions } from './EnexDumperOptions';
import { ReadableStream } from 'web-streams-polyfill/ponyfill/es6';
import fs  =require('fs');

import { downloadTestFiles } from './downloadTestFiles.spec';

if(!(process.env["TEST_LARGE_FILES"] === "no")) {
    beforeAll(async () => {
        await downloadTestFiles();
    }, 180_000);
}



const defaultOptions = new EnexDumperOptions();

export function arrayToStream(array: Uint8Array): ReadableStream {
return new ReadableStream({
    start(controller) {
        controller.enqueue(array);
        controller.close();
    },
  })
}

export function stringToStream(str: string): ReadableStream {
    return arrayToStream(new TextEncoder().encode(str));
}

it('works to ignore an empty resource', async () => {
    const resource = createResource();
    const dump = await dumpResource(resource, defaultOptions);
    expect(dump).toEqual("");
});

it('works to dump a textual resource', async () => {
    const testData = "Hallo Welt!";

    const stream = stringToStream(testData);
    const resource = createResource({dataStream: stream});
    const dump = await dumpResource(resource, defaultOptions);
    expect(resource.base64data).toEqual("SGFsbG8gV2VsdCE=");
    expect(resource.md5).toEqual("55243ecf175013cfe9890023f9fd9037");
    expect(dump).toContain("<resource>");
    const resourceRE = new RegExp(`<resource>.*<data encoding="base64">.*${resource.base64data}.*</data>.*</resource>`, 's');
    expect(resourceRE.test(dump)).toBeTruthy();
});


it('works to dump a large resource', async () => {
    if(process.env["TEST_LARGE_FILES"] === "no") {
        expect(true).toBeTruthy();
        return;
    }

    const testData = fs.readFileSync('testdata/data/20mb.zip');
    const stream = arrayToStream(testData);
    const resource = createResource({dataStream: stream, filename: '20mb.zip'});
    const dump = await dumpResource(resource, defaultOptions);
    
    expect(resource.base64data?.startsWith("UEsDBBQAAAAIANi580TC")).toBeTruthy();
    expect(resource.base64data?.endsWith("AEAAQBKAAAAKuo+AQAA")).toBeTruthy();
    expect(resource.md5).toEqual("e91b5bbf9a9bacc563541361ebad1392");
    expect(dump).toContain("<resource>");
});
