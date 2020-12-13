import { createResource } from './NoteSource';
import { dumpResource } from './ResourceDumper';
import { EnexDumperOptions } from './EnexDumperOptions';
import { ReadableStream } from 'web-streams-polyfill/ponyfill/es6';
import fs  =require('fs');

import { downloadTestFiles } from './downloadTestFiles.spec';

beforeAll(async () => {
    await downloadTestFiles();
}, 180_000);



const defaultOptions = new EnexDumperOptions();

function arrayToStream(array: Uint8Array) {
return new ReadableStream({
    start(controller) {
        controller.enqueue(array);
        controller.close();
    }
  })
}

function stringToStream(str: string) {
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
    console.log(dump);
    expect(resource.base64data).toEqual("SGFsbG8gV2VsdCE=");
    expect(resource.md5).toEqual("55243ecf175013cfe9890023f9fd9037");
    expect(dump).toContain("<resource>");
    // TODO fruther tests
});


it('works to dump a textual resource', async () => {
    const testData = fs.readFileSync('test/data/20mb.zip');
    const stream = arrayToStream(testData);
    const resource = createResource({dataStream: stream, filename: '20mb.zip'});
    const dump = await dumpResource(resource, defaultOptions);
    
    expect(resource.base64data?.startsWith("eZn1CcXCyE4290Quzu55")).toBeTruthy();
    expect(resource.base64data?.endsWith("JHlrSk/+HyRDZTeMJQLqkfE=")).toBeTruthy();
    expect(resource.md5).toEqual("b3215c06647bc550406a9c8ccc378756");
    expect(dump).toContain("<resource>");
    // TODO fruther tests
});


// TODO further tests