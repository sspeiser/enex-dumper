import { Observer } from 'rxjs';
import { format } from 'date-fns';
import { EnexDumperOptions } from './EnexDumperOptions';
import { Note } from './NoteSource';
import { dumpNote } from "./NoteDumper";


export type StringWriter = {
    write(str: string): Promise<void>;
    close(): Promise<void>;
}

export class EnexDumper implements Observer<Note> {
    private noteDumps: Promise<boolean | void>[] = [];

    readonly done;
    private resolve?: () => void;

    constructor(private writer: StringWriter, private options: EnexDumperOptions = new EnexDumperOptions()) {
        this.done = new Promise<void>((resolve) => this.resolve = resolve);
        writer.write(`<?xml version="1.0" encoding="UTF-8"?>
          <!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export3.dtd">
          <en-export export-date="${format(new Date(), options.dateFormat)}" application="${options.exportApplication}" version="${options.exportApplicationVersion}">`
        );
    }

    next(note: Note): void {

        this.noteDumps.push(dumpNote(note, this.options).then((notestr) => {
            // try {
                return this.writer.write(notestr)
            // } catch (error) {
                // console.log(`Error ${error} while writing dump ${notestr}`);
            // }
        }));
    }

    error(error: unknown): void {
        console.log(error);
        this.complete();
    }

    complete(): void {
        Promise.all(this.noteDumps).then(() => {
            // try {
                return this.writer.write('</en-export>').then(() => { return this.writer.close() });
            // } catch (error) {
                // console.log(`Error ${error} while completing after dumping ${this.noteDumps.length} notes`);
            // }
        }).then(() => {
            if (this.resolve) this.resolve();
        });
    }
}
