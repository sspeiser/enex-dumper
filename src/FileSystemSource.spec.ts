import { EnexDumperOptions } from './EnexDumperOptions';
import { EnexDumper } from './EnexDumper';
import { recursiveHTMLDumper, WritableFile } from './FileSystemSource';

/**
 * @jest-environment jsdom
 */

it('works somehow', async () => {
    const options = new EnexDumperOptions();
    const writer = new WritableFile("testdata/data/output.enex");
    const dumper = new EnexDumper(writer, options);
    // throw new TypeError("hook");
    recursiveHTMLDumper('testdata/html', dumper);
    await dumper.done;
    await writer.result;
}, 240_000);
