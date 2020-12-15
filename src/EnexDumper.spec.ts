import { Observable } from 'rxjs';
import { WritableStream } from 'web-streams-polyfill/ponyfill/es6';
// import { WritableStream } from 'streams';
import { EnexDumper } from './EnexDumper';
import { Note, createNote } from './NoteSource';


class WritableString {
    private strings: string[] = [];
    private resolve?: (_: string) => void;
    readonly result: Promise<string>;
    private writableStream: WritableStream<string | void>;

    constructor() {
        this.result = new Promise<string>((resolve) => this.resolve = resolve);
        const strings = this.strings;
        const resolve = this.resolve;
        this.writableStream = new WritableStream({
            write(chunk: string | void) {
                return new Promise<void>((resolve) => {
                    if (chunk) {
                        strings.push(chunk);
                    }
                    resolve();
                });
            },
            close() {
                if (resolve)
                    resolve(strings.join(''));
            }
        });
    }

    public getWriter() {
        return this.writableStream.getWriter();
    }
}

it('works to use string writer', async () => {
    const writableString = new WritableString();
    const writer = writableString.getWriter()
    writer.write("Hello World!");
    writer.write(" ");
    writer.write("Hallo Welt!");
    writer.close();
    const result = await writableString.result;
    expect(result).toEqual("Hello World! Hallo Welt!");
});

test("empty export", async () => {
    const writableString = new WritableString();
    const writer = writableString.getWriter()
    const enexDumper = new EnexDumper(writer);

    new Observable<Note>(subscriber => {
        subscriber.complete();
    }).subscribe(enexDumper);

    const result = await writableString.result;

    expect(result).toContain('</en-export');
});

it('works to export a single note with only title', async () => {
    const writableString = new WritableString();
    const writer = writableString.getWriter()
    const enexDumper = new EnexDumper(writer);

    new Observable<Note>(subscriber => {
        subscriber.next(createNote({title: "Example Title"}));
        subscriber.complete();
    }).subscribe(enexDumper);

    const result = await writableString.result;

    const matchDocRE = /<note>.*<title>Example Title<\/title>.*<\/note>/s;
    expect(matchDocRE.test(result)).toBeTruthy();
});

it('works to receive an error from the observable and still close the stream', async () => {
    const writableString = new WritableString();
    const writer = writableString.getWriter()
    const enexDumper = new EnexDumper(writer);

    new Observable<Note>(subscriber => {
        subscriber.error('Test error');
    }).subscribe(enexDumper);

    const result = await writableString.result;
    expect(result).toContain('</en-export');
});