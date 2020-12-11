

class Loadable<T> {
    o: T;
    loaded = false;

    constructor(o: T, private load?: (o: T) => void) {
        this.o = o;
    }

    public awaitLoad(): void {
        if (!this.loaded && this.load) {
            this.load(this.o);
        }
        this.loaded = true;
    }
}

function loadable<T>(properties: Record<keyof T, undefined>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function <U extends T>(o: T, load?: (o: T) => void): T {
        const l = new Loadable<T>(o, load);
        for (const property of Object.keys(properties) as Array<keyof T>) {
            Object.defineProperty(l, property, {
                get: function () {
                    if (l.o[property] || l.o[property] === null) return l.o[property];
                    l.awaitLoad();
                    return l.o[property];
                }
            })
        }
        return l as unknown as T;
    }
}


export interface Note {
    title?: string | null,
    content?: HTMLDocument | null,
    author?: string | null,
    tags?: string[] | null,
    resources?: IResource[] | null,
    created?: Date | null,
    updated?: Date | null,
    latitude?: number | null,
    longitude?: number | null
}

const propsNote: Record<keyof Note, undefined> = {
    title: undefined, content: undefined, author: undefined,
    tags: undefined, resources: undefined, created: undefined,
    updated: undefined, latitude: undefined, longitude: undefined
}

const loadableNote = loadable<Note>(propsNote);

export function createNote(props?: Partial<Note>, load?: (note: Note) => void): Note {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allProps:any = {};
    for(const key of Object.keys(propsNote) as Array<keyof Note>) {
        allProps[key] = undefined;
    }
    if (props) {
        for (const key of Object.keys(props) as Array<keyof Partial<Note>>) {
            allProps[key] = props[key];
        }
    }
    return loadableNote(allProps as Note, load);
}

export interface IResource {
    empty?: boolean;
}
