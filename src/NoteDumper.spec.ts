import { NoteDumper } from './NoteDumper';
import { Note } from './NoteSource';
import { JSDOM } from 'jsdom';
import { format } from 'date-fns';
import { EnexDumperOptions } from './EnexDumperOptions';

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
    const authorNote = new Note({ author: props.author });
    const authorResult = await NoteDumper.dump(authorNote, defaultOptions);
    const authorRE = new RegExp(`<note>.*<author>.*${props.author}.*</author>.*</note>`, 's');
    expect(authorRE.test(authorResult)).toBeTruthy();
});

it('works to export a note with content', async () => {
    const contentNote = new Note({ content: props.content });
    const contentResult = await NoteDumper.dump(contentNote, defaultOptions);
    const contentRE = new RegExp(`<note>.*<content>.*${props.content}.*</content>.*</note>`, 's');
    expect(contentRE.test(contentResult)).toBeTruthy();
});

it('works to export a note with created', async () => {
    const createdNote = new Note({ created: props.created });
    const createdResult = await NoteDumper.dump(createdNote, defaultOptions);
    const createdRE = new RegExp(`<note>.*<created>.*${format(props.created, defaultOptions.dateFormat)}.*</created>.*</note>`, 's');
    expect(createdRE.test(createdResult)).toBeTruthy();
});

it('works to export a note with latitude', async () => {
    const latitudeNote = new Note({ latitude: props.latitude });
    const latitudeResult = await NoteDumper.dump(latitudeNote, defaultOptions);
    const latitudeRE = new RegExp(`<note>.*<latitude>.*${props.latitude}.*</latitude>.*</note>`, 's');
    expect(latitudeRE.test(latitudeResult)).toBeTruthy();
});

it('works to export a note with longitude', async () => {
    const longitudeNote = new Note({ longitude: props.longitude });
    const longitudeResult = await NoteDumper.dump(longitudeNote, defaultOptions);
    const longitudeRE = new RegExp(`<note>.*<longitude>.*${props.longitude}.*</longitude>.*</note>`, 's');
    expect(longitudeRE.test(longitudeResult)).toBeTruthy();
})

it('works to export a note with title', async () => {
    const titleNote = new Note({ title: props.title });
    const titleResult = await NoteDumper.dump(titleNote, defaultOptions);
    const titleRE = new RegExp(`<note>.*<title>.*${props.title}.*</title>.*</note>`, 's');
    expect(titleRE.test(titleResult)).toBeTruthy();
});

it('works to export a note with updated', async () => {
    const updatedNote = new Note({ updated: props.updated });
    const updatedResult = await NoteDumper.dump(updatedNote, defaultOptions);
    const updatedRE = new RegExp(`<note>.*<updated>.*${format(props.updated, defaultOptions.dateFormat)}.*</updated>.*</note>`, 's');
    expect(updatedRE.test(updatedResult)).toBeTruthy();
});

it('works to export a note with tags', async () => {
    const tagsNote = new Note({ tags: props.tags });
    const tagsResult = await NoteDumper.dump(tagsNote, defaultOptions);
    const tagsRE = new RegExp(`<note>.*<tag>${props.tags.join('</tag>.*<tag>')}</tag>.*</note>`, 's');
    expect(tagsRE.test(tagsResult)).toBeTruthy();
});

