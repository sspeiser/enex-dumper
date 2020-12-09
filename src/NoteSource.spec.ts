import { Note } from './NoteSource';
import { JSDOM } from 'jsdom';


it('works to create an empty note', () => {
    const note = new Note();
    expect(note.author).toBeUndefined;
    expect(note.content).toBeUndefined;
    expect(note.created).toBeUndefined;
    expect(note.latitude).toBeUndefined;
    expect(note.longitude).toBeUndefined;
    expect(note.title).toBeUndefined;
    expect(note.updated).toBeUndefined;
    expect(note.tags).toEqual([]);
    expect(note.resources).toEqual([]);
})

it('works to create a note with all properties sets', () => {
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
    const note = new Note(props);
    expect(note.author).toEqual(props.author);
    expect(note.content).toEqual(props.content);
    expect(note.created).toEqual(props.created);
    expect(note.latitude).toEqual(props.latitude);
    expect(note.longitude).toEqual(props.longitude);
    expect(note.title).toEqual(props.title);
    expect(note.updated).toEqual(props.updated);
    expect(note.tags).toEqual(props.tags);
    expect(note.resources).toEqual(props.resources);
})