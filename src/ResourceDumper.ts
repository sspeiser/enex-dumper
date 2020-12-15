import { EnexDumperOptions } from './EnexDumperOptions';
import { Resource } from './NoteSource';
import SparkMD5 = require('spark-md5');
import { bytesToBase64 } from "byte-base64";
import { WritableStream } from 'web-streams-polyfill/ponyfill/es6';



export async function dumpResource(resource: Resource, options: EnexDumperOptions): Promise<string> {
    const md5stream = new MD5Stream();
    const base64stream = new Base64Stream();
    // const streamPromises: Promise<string | void>[] = [];
    try {
        if (resource.dataStream && !resource.dataStream.locked) {
            const [md5readstream, base64readstream] = resource.dataStream.tee();
            // if (!resource.md5) {
            md5readstream.pipeTo(md5stream.writableStream);

            // }
            // if (!resource.base64data) {
            base64readstream.pipeTo(base64stream.writableStream);
            //then(() => resource.base64data = base64stream.getBase64(), console.log);
            //streamPromises.push(base64promise);
            // }
            resource.md5 = await md5stream.md5;
            resource.base64data = await base64stream.base64data;
            return `<resource>
                    <data encoding="base64">${resource.base64data}</data>
                    <mime>${resource.mimetype}</mime>
                    ${resource.width ? `<width>${resource.width}</width>` : ''}
                    ${resource.height ? `<height>${resource.height}</height>` : ''}
                    <resource-attributes>
                        <file-name>${resource.filename}</file-name>
                    </resource-attributes>
                </resource>`
        }
    } catch (error) {
        // Probably could not read stream
        console.log(error);
    }
    return "";
}

class MD5Stream {
    private resolve?: (_: string) => void;
    readonly md5: Promise<string>;
    readonly writableStream: WritableStream;

    constructor() {
        const spark = new SparkMD5.ArrayBuffer();
        this.md5 = new Promise<string>((r) => this.resolve = r);
        const resolve = this.resolve;
        this.writableStream = new WritableStream({
            write(chunk) {
                return new Promise<void>((r) => {
                    if (chunk) {
                        if (chunk instanceof Uint8Array) {
                            spark.append(chunk.buffer);
                        }
                    }
                    r();
                });
            },
            close() {
                if (resolve)
                    resolve(spark.end());
            }
        });
    }
}


class Base64Stream {
    private resolve?: (_: string) => void;
    readonly base64data: Promise<string>;
    readonly writableStream: WritableStream;

    constructor() {
        let base64string = "";
        this.base64data = new Promise<string>((r) => this.resolve = r);
        const resolve = this.resolve;
        this.writableStream = new WritableStream({
            write(chunk) {
                return new Promise<void>((r) => {
                    if (chunk) {
                        if (chunk instanceof Uint8Array) {
                            base64string += bytesToBase64(chunk);
                        }
                    }
                    r();
                });
            },
            close() {
                if (resolve)
                    resolve(base64string);
            }
        });
    }
}