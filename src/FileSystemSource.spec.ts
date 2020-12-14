import { EnexDumperOptions } from './EnexDumperOptions';
import { EnexDumper } from './EnexDumper';
import { recursiveHTMLDumper, WritableFile } from './FileSystemSource';
import { downloadTestFiles } from './downloadTestFiles.spec';
import fs = require('fs');


/**
 * @jest-environment jsdom
 */


beforeAll(async () => {
    await downloadTestFiles();
}, 180_000);





it('works somehow', async () => {
    const options = new EnexDumperOptions();
    // streamSaver.WritableStream = ponyfill.WritableStream
    // const fileStream = streamSaver.createWriteStream("test/output.enex");
    const fileStream = new WritableFile("test/data/output.enex");
    const writer = fileStream.getWriter();
    const dumper = new EnexDumper(writer, options);
    // throw new TypeError("hook");
    recursiveHTMLDumper('test/html', dumper);
    await dumper.done;
    await fileStream.result;
    // TODO: Real test ... check for file, resources, subfolder, title for no title, ...
}, 240_000);

// TODO: Test for nonexisting file