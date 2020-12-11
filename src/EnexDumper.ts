import { Observer } from 'rxjs';
import { format } from 'date-fns';
import { EnexDumperOptions } from './EnexDumperOptions';
import { Note } from './NoteSource';
import { NoteDumper } from "./NoteDumper";

export class EnexDumper implements Observer<Note> {
    private noteDumps: Promise<boolean | void>[] = [];

    constructor(private writer: WritableStreamDefaultWriter<string | void>, private options: EnexDumperOptions = new EnexDumperOptions()) {
        this.writer.ready.then(() => writer.write(`<?xml version="1.0" encoding="UTF-8"?>
          <!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export3.dtd">
          <en-export export-date="${format(new Date(), options.dateFormat)}" application="${options.exportApplication}" version="${options.exportApplicationVersion}">`
        ));
    }

    next(note: Note): void {
        this.noteDumps.push(NoteDumper.dump(note, this.options).then((notestr) => {
            this.writer.ready.then(() => this.writer.write(notestr));
        }));
    }

    error(error: unknown): void {
        console.log(error);
        this.complete();
    }

    complete(): void {
        Promise.all(this.noteDumps).
            then(() => {
                this.writer.ready.then(() => this.writer.write('</en-export>'));
                this.writer.ready.then(() => this.writer.close());
            });
    }
}