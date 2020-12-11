import { Note, createNote } from './NoteSource';
import { JSDOM } from 'jsdom';

const props: Note = {
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

it('works to create an empty note', () => {
    const note = createNote();
    expect(note.author).toBeUndefined();
    expect(note.content).toBeUndefined();
    expect(note.created).toBeUndefined();
    expect(note.latitude).toBeUndefined();
    expect(note.longitude).toBeUndefined();
    expect(note.title).toBeUndefined();
    expect(note.updated).toBeUndefined();
    expect(note.tags).toBeUndefined();
    expect(note.resources).toBeUndefined();
})

it('works to create a note with all properties sets', () => {
    const note = createNote(props);
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

it('works to create a note with some properties sets', () => {
    const note = createNote({title: props.title, author: props.author});
    expect(note.author).toEqual(props.author);
    expect(note.title).toEqual(props.title);
    expect(note.content).toBeUndefined();
    expect(note.created).toBeUndefined();
    expect(note.latitude).toBeUndefined();
    expect(note.longitude).toBeUndefined();
    expect(note.updated).toBeUndefined();
    expect(note.tags).toBeUndefined();
    expect(note.resources).toBeUndefined();
})


it('works to create a note which loads properties from function', () => {
    const note = createNote({}, (note: Note) => {
        note.author = props.author;
    });
    expect(note.author).toEqual(props.author);
    expect(note.title).toBeUndefined();
})

it('works that load function is only invoked when non-initialized property is requested', () => {
    let loadFunctionInvoked = false;
    const note3 = createNote({title: props.title}, (note: Note) => {
        note.author = 'Joe Doe IInd';
        loadFunctionInvoked = true;
    });
    expect(note3.title).toEqual(props.title);
    expect(loadFunctionInvoked).toBeFalsy();
    expect(note3.author).toEqual('Joe Doe IInd');
    expect(loadFunctionInvoked).toBeTruthy();
    expect(note3.content).toBeUndefined;
})

it('works the strange behavior that a prop can be initialized and then overriden by load function', () => {
    let loadFunctionInvoked = false;
    const note = createNote({title: props.title, author: 'Jane Doe'}, (note: Note) => {
        note.author = props.author;
        loadFunctionInvoked = true;
    });
    expect(note.title).toEqual(props.title);
    expect(loadFunctionInvoked).toBeFalsy();
    expect(note.author).toEqual('Jane Doe');
    expect(loadFunctionInvoked).toBeFalsy();
    expect(note.content).toBeUndefined;
    expect(loadFunctionInvoked).toBeTruthy();
    expect(note.author).toEqual(props.author);
})