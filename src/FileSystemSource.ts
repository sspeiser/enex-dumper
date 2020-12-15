import { Note, createNote, createResource, Resource } from './NoteSource';
import { ReadableStream } from 'web-streams-polyfill/ponyfill/es6';
import { EnexDumper, StringWriter } from './EnexDumper';
import fs = require('fs');
import { JSDOM } from 'jsdom';
import ext2mime from './ext2mime';


export class WritableFile implements StringWriter {
    readonly result: Promise<void>;
    private resolve?: () => void;

    private fd: number;

    constructor(filename: string) {
        this.result = new Promise<void>((resolve) => this.resolve = resolve);
        this.fd = fs.openSync(filename, 'w');
    }

    public write(str: string): void {
        fs.writeSync(this.fd, str);
    }

    public close(): void {
        fs.closeSync(this.fd);
        if (this.resolve) {
            this.resolve();
        }
    }
}

function fileToStream(path: string) {
    return new ReadableStream({
        start(controller) {
            try {
                controller.enqueue(fs.readFileSync(path));
            } catch (error) {
                console.log(error);
            }
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

    const images: HTMLImageElement[] = [];
    for (const image of document.getElementsByTagName('img')) {
        images.push(image);
    }
    for (const image of images) {
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

    const objects: HTMLObjectElement[] = [];
    for (const object of document.getElementsByTagName('object')) {
        objects.push(object);
    }
    for (const object of objects) {
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
    let author: string | null = null;

    for (const meta of document.head.getElementsByTagName("meta")) {
        if (meta.getAttribute('name') === 'author') {
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
    const files = fs.readdirSync(path).map((file) => path + '/' + file);
    while (files.length > 0) {
        const file = files.pop();
        if (!file) continue;
        if (fs.lstatSync(file).isDirectory()) {
            Array.prototype.push.apply(files, fs.readdirSync(file).map((newfile) => file + '/' + newfile));
        } else {
            if (file.toLowerCase().endsWith('html')) {
                dumper.next(noteFromHTML(file));
            }
        }

    }
    dumper.complete();
}
