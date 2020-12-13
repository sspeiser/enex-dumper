import { EnexDumperOptions } from './EnexDumperOptions';
import { EnexDumper } from './EnexDumper';
import { WritableFile, recursiveHTMLDumper } from './FileSystemSource';
import { downloadTestFiles } from './downloadTestFiles.spec';
// import streamSaver from "streamsaver";
// import * as ponyfill from 'web-streams-polyfill/ponyfill';


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
}, 240_000);

// TODO: Test for nonexisting file