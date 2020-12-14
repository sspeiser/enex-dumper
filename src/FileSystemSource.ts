import { Note, createNote, createResource, Resource } from './NoteSource';
import { WritableStream, ReadableStream, CountQueuingStrategy } from 'web-streams-polyfill/ponyfill/es6';
import { EnexDumper } from './EnexDumper';
import fs = require('fs');
import { JSDOM } from 'jsdom';
import ext2mime from './ext2mime';


export class WritableFile {
    private strings: string[] = [];
    readonly result;
    private resolve?: () => void;
    private writableStream: WritableStream<string | void>;

    constructor(filename: string) {
        const file = fs.createWriteStream(filename);
        this.result = new Promise<void>((resolve) => this.resolve = resolve);
        const resolve = this.resolve;
        this.writableStream = new WritableStream({
            write(chunk) {
                return new Promise<void>((resolve) => {
                    if (chunk) {
                        file.write(chunk);
                    }
                    resolve();
                });
            },
            close() {
                file.close();
                if (resolve)
                    resolve();
            }
        }, new CountQueuingStrategy({ highWaterMark: 1024 }));
    }

    public getWriter(): WritableStreamDefaultWriter {
        return this.writableStream.getWriter();
    }
}

function fileToStream(path: string) {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(fs.readFileSync(path));
            controller.close();
        }
    })
}



function loadResource(noteFile: string) {
    return async (resource: Resource) => {
        if (resource.url) {

            const iSlash = noteFile.lastIndexOf('/');
            let path = '';
            if (iSlash) {
                path = noteFile.substring(0, iSlash);
            }
            resource.dataStream = fileToStream(path + '/' + resource.url);
        }
    }
}

function escapeHTML(document: HTMLDocument, str: string): string {
    const pre = document.createElement('pre');
    const text = document.createTextNode(str);
    pre.appendChild(text);
    return pre.innerHTML;
}

function noteFromHTML(file: string): Note {
    const stats = fs.lstatSync(file);
    const content = fs.readFileSync(file).toString();
    const document = new JSDOM(content).window.document;
    const resources: Resource[] = [];
    for (const image of document.getElementsByTagName("img")) {
        if (!image.src)
            continue;
        if (!image.src.includes(':') || image.src.startsWith('file:')) {
            const propsResource = {
                url: image.src,
                filename: image.src.split('/').pop(),
                mimetype: ext2mime(image.src.split('.').pop() || 'dat'),
                width: image.width || undefined,
                height: image.height || undefined,
            }
            resources.push(createResource(propsResource, loadResource(file)));
        }
    }
    for (const object of document.getElementsByTagName("object")) {
        if (!object.data)
            continue;
        if (!object.data.includes(':') || object.data.startsWith('file:')) {
            const propsResource = {
                url: object.data,
                filename: object.data.split('/').pop(),
                mimetype: ext2mime(object.data.split('.').pop() || 'dat'),
            }
            resources.push(createResource(propsResource, loadResource(file)));
        }
    }
    let author:string | null = null;
    for(const meta of document.head.getElementsByTagName("meta")) {
        if(meta.getAttribute('name') == 'author') {
            author = meta.getAttribute('content');
        }
    }

    const propsNote = {
        title: document.title || escapeHTML(document, file.split('/').pop() || 'No title'),
        tags: [escapeHTML(document, file.replace(/\//, '.'))],
        author: author,
        content: document,
        resources: resources,
        created: stats.ctime,
        updated: stats.mtime,
    }
    return createNote(propsNote);
}

export function recursiveHTMLDumper(path: string, dumper: EnexDumper): void {
    const files = fs.readdirSync(path)
    files.forEach(file => {
        const filePath = path + '/' + file;
        if (fs.lstatSync(filePath).isDirectory()) {
            recursiveHTMLDumper(filePath, dumper);
        } else {
            if (file.toLowerCase().endsWith('html')) {
                dumper.next(noteFromHTML(filePath));
            }
        }
    });
    dumper.complete();
}
