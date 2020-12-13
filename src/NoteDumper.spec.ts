import { dumpNote } from './NoteDumper';
import { createNote } from './NoteSource';
import { JSDOM } from 'jsdom';
import { format } from 'date-fns';
import { EnexDumperOptions } from './EnexDumperOptions';
import { downloadTestFiles } from './downloadTestFiles.spec';

beforeAll(async () => {
    await downloadTestFiles();
}, 180_000);

const props = {
    author: 'Joe Doe',
    content: new JSDOM("<html><body>Content</body></html>").window.document,
    created: new Date(),
    latitude: 40.0,
    longitude: 30.0,
    title: 'Example Note',
    updated: new Date(),
    tags: ['tag1', 'tag2'],
    resources: []
}

const defaultOptions = new EnexDumperOptions();


it('works to export a note with author', async () => {
    const authorNote = createNote({ author: props.author });
    const authorResult = await dumpNote(authorNote, defaultOptions);
    const authorRE = new RegExp(`<note>.*<author>.*${props.author}.*</author>.*</note>`, 's');
    expect(authorRE.test(authorResult)).toBeTruthy();
});

it('works to export a note with content', async () => {
    const contentNote = createNote({ content: props.content });
    const contentResult = await dumpNote(contentNote, defaultOptions);
    const contentRE = new RegExp(`<note>.*<content>.*${props.content}.*</content>.*</note>`, 's');
    expect(contentRE.test(contentResult)).toBeTruthy();
});

it('works to export a note with created', async () => {
    const createdNote = createNote({ created: props.created });
    const createdResult = await dumpNote(createdNote, defaultOptions);
    const createdRE = new RegExp(`<note>.*<created>.*${format(props.created, defaultOptions.dateFormat)}.*</created>.*</note>`, 's');
    expect(createdRE.test(createdResult)).toBeTruthy();
});

it('works to export a note with latitude', async () => {
    const latitudeNote = createNote({ latitude: props.latitude });
    const latitudeResult = await dumpNote(latitudeNote, defaultOptions);
    const latitudeRE = new RegExp(`<note>.*<latitude>.*${props.latitude}.*</latitude>.*</note>`, 's');
    expect(latitudeRE.test(latitudeResult)).toBeTruthy();
});

it('works to export a note with longitude', async () => {
    const longitudeNote = createNote({ longitude: props.longitude });
    const longitudeResult = await dumpNote(longitudeNote, defaultOptions);
    const longitudeRE = new RegExp(`<note>.*<longitude>.*${props.longitude}.*</longitude>.*</note>`, 's');
    expect(longitudeRE.test(longitudeResult)).toBeTruthy();
})

it('works to export a note with title', async () => {
    const titleNote = createNote({ title: props.title });
    const titleResult = await dumpNote(titleNote, defaultOptions);
    const titleRE = new RegExp(`<note>.*<title>.*${props.title}.*</title>.*</note>`, 's');
    expect(titleRE.test(titleResult)).toBeTruthy();
});

it('works to export a note with updated', async () => {
    const updatedNote = createNote({ updated: props.updated });
    const updatedResult = await dumpNote(updatedNote, defaultOptions);
    const updatedRE = new RegExp(`<note>.*<updated>.*${format(props.updated, defaultOptions.dateFormat)}.*</updated>.*</note>`, 's');
    expect(updatedRE.test(updatedResult)).toBeTruthy();
});

it('works to export a note with tags', async () => {
    const tagsNote = createNote({ tags: props.tags });
    const tagsResult = await dumpNote(tagsNote, defaultOptions);
    const tagsRE = new RegExp(`<note>.*<tag>${props.tags.join('</tag>.*<tag>')}</tag>.*</note>`, 's');
    expect(tagsRE.test(tagsResult)).toBeTruthy();
});

