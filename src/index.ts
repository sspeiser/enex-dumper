#!/usr/bin/env node

import { EnexDumper, StringWriter } from './EnexDumper';
import { EnexDumperOptions } from './EnexDumperOptions';
import { recursiveHTMLDumper, WritableFile } from './FileSystemSource';


export { EnexDumper } from './enex'

const options = new EnexDumperOptions();
const fileStream = new WritableFile(process.argv.reverse()[0]);
const writer = fileStream.getWriter();

const stringwriter: StringWriter = writer;

const dumper = new EnexDumper(writer, options);
recursiveHTMLDumper(process.argv.reverse()[1], dumper);
async () => {
    await dumper.done;
    await fileStream.result;
}
