import { EnexDumperOptions } from './EnexDumperOptions';
import { Note } from './NoteSource';
import { format } from 'date-fns';


export class NoteDumper {
    static async dump(note: Note, options: EnexDumperOptions): Promise<string> {
        let str = `<note>
          <title>${note.title}</title>\n`;
        const content = note.content;
        if (content) {
            str += `  <content>
                <![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
                <en-note>
                ${content.body}
                <en-note>
                ]]>
            </content>\n`
        }
        if(note.created) {
            str += `  <created>${format(note.created, options.dateFormat)}</created>\n`;
        }
        if(note.updated) {
            str += `  <updated>${format(note.updated, options.dateFormat)}</updated>\n`;
        }
        if(note.tags) {
            for(const tag of note.tags) {
                str += `  <tag>${tag}</tag>\n`;
            }
        }
        if(note.latitude || note.longitude || note.author) {
            str += ` <note-attributes>\n`;
            if(note.latitude) {
                str += `    <latitude>${note.latitude}</latitude>\n`;
            }
            if(note.longitude) {
                str += `    <longitude>${note.longitude}</longitude>\n`;
            }
            if(note.author) {
                str += `    <author>${note.author}</author>\n`;
            }
            str += `  </note-attributes>\n`;
        }
    // if(note.resources) {     for(const resource of note.resources) {
    //         str += `  <resource>\n`;
    //          <!ELEMENT resource
    //    (data, mime, width?, height?, duration?, recognition?, resource-attributes?,
    //    alternate-data?)
    //         str += `  </resource>\n`;
    //     }
    // }

        str += `</note>`;
        return str;
    }
}
