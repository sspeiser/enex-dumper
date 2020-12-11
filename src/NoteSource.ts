

interface LoadableProperties {
    isLoaded(): boolean;
    awaitLoad(): void;
}

function ensureLoaded<T>() {
    return function (target: LoadableProperties, propertyKey: string) {
        let value: T;
        const getter = function () {
            if (value) return value;
            if (target.isLoaded()) return undefined;
            target.awaitLoad();
            return value;
        };
        const setter = function (newVal: T) {
            value = newVal;
        };
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter
        });
    }
}


export class Note implements LoadableProperties {
    public load(): void {
        return;
    }
    // } Promise<void> {
    //     return new Promise((resolve) => resolve());
    // }

    private loaded = false;
    public isLoaded(): boolean {
        return this.loaded;
    }
    public awaitLoad(): void {
        this.load();
        this.loaded = true;
    }

    @ensureLoaded()
    public title?: string;
    @ensureLoaded()
    public content?: HTMLDocument;
    @ensureLoaded()
    public author?: string;
    @ensureLoaded()
    public tags: string[] = [];
    @ensureLoaded()
    public resources: Resource[] = [];
    @ensureLoaded()
    public created?: Date;
    @ensureLoaded()
    public updated?: Date;
    @ensureLoaded()
    public latitude?: number;
    @ensureLoaded()
    public longitude?: number;

    constructor(props?: Partial<{
        title?: string,
        content?: HTMLDocument,
        author?: string,
        tags: string[],
        resources: Resource[],
        created?: Date,
        updated?: Date,
        latitude?: number,
        longitude?: number
    }>) {
        if (props) {
            if (props.title) this.title = props.title;
            if (props.content) this.content = props.content;
            if (props.author) this.author = props.author;
            if (props.tags) this.tags = props.tags;
            if (props.resources) this.resources = props.resources;
            if (props.created) this.created = props.created;
            if (props.updated) this.updated = props.updated;
            if (props.latitude) this.latitude = props.latitude;
            if (props.longitude) this.longitude = props.longitude;
        }
    }
}

abstract class Resource implements LoadableProperties {
        public load(): void {
            return;
        }
        
        private loaded = false;
        public isLoaded(): boolean {
            return this.loaded;
        }
        public awaitLoad(): void {
            this.load();
            this.loaded = true;
        }
    
        @ensureLoaded()
        public id?: string;
        @ensureLoaded()
        public dataStream?: ReadableStream;
        @ensureLoaded()
        public filename?: string;
        @ensureLoaded()
        public mimetype?: string;
        
}