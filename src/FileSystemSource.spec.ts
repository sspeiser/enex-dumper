import { EnexDumperOptions } from './EnexDumperOptions';
import { EnexDumper } from './EnexDumper';
import { recursiveHTMLDumper, WritableFile } from './FileSystemSource';
import { downloadTestFiles } from './downloadTestFiles.spec';


/**
 * @jest-environment jsdom
 */


beforeAll(async () => {
    await downloadTestFiles();
}, 180_000);





it('works somehow', async () => {
    const options = new EnexDumperOptions();
    const writer = new WritableFile("testdata/data/output.enex");
    const dumper = new EnexDumper(writer, options);
    // throw new TypeError("hook");
    recursiveHTMLDumper('testdata/html', dumper);
    await dumper.done;
    await writer.result;
    // TODO: Real test ... check for file, resources, subfolder, title for no title, ...
}, 240_000);

// TODO: Test for nonexisting file