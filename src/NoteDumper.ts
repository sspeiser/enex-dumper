import { EnexDumperOptions } from './EnexDumperOptions';
import { Note, Resource } from './NoteSource';
import { format } from 'date-fns';
import { dumpResource } from './ResourceDumper';


function replaceResources(content: HTMLDocument, resources: Resource[], options: EnexDumperOptions) {
    const urls: { [key: string]: Resource } = {};
    for (const resource of resources) {
        if (resource.url)
            urls[resource.url] = resource;
    }

    // console.log('How many tags are here?: ' + content.body.innerHTML);
    // console.log(`We have ${content.getElementsByTagName('img').length} images and ${content.getElementsByTagName('object').length} objects and ${resources.length} resources`);
    
    const images: HTMLImageElement[] = [];
    for(const image of content.getElementsByTagName('img')) {
        images.push(image);
    }
    for (const image of images) {
        // console.log(`Replacing ${image.src} (${image.outerHTML})`);
        const resource = urls[image.src];
        const enmedia = content.createElement("en-media");
        enmedia.setAttribute("alt", resource.filename || "");
        enmedia.setAttribute("type", resource.mimetype || "");
        enmedia.setAttribute("hash", resource.md5 || "");
        if (resource.width)
            enmedia.setAttribute("width", "" + resource.width);
        if (resource.height)
            enmedia.setAttribute("height", "" + resource.height);
        image.replaceWith(enmedia);
        // console.log("Replaced resource: " + image.outerHTML + "with " + enmedia.outerHTML);
        // console.log(`We have ${content.getElementsByTagName('img').length} images and ${content.getElementsByTagName('object').length} objects and ${resources.length} resources`);
    }

    const objects: HTMLObjectElement[] = [];
    for(const object of content.getElementsByTagName('object')) {
        objects.push(object);
    }
    
    for (const object of objects) {
        // console.log(`Replacing ${object.data} (${object.outerHTML})`);
        const resource = urls[object.data];
        const enmedia = content.createElement("en-media");
        enmedia.setAttribute("alt", resource.filename || "");
        enmedia.setAttribute("type", resource.mimetype || "");
        enmedia.setAttribute("hash", resource.md5 || "");
        if (resource.width)
            enmedia.setAttribute("width", "" + resource.width);
        if (resource.height)
            enmedia.setAttribute("height", "" + resource.height);
        object.replaceWith(enmedia);
        // console.log("Replaced resource: " + object.outerHTML + "with " + enmedia.outerHTML);
        // console.log(`We have ${content.getElementsByTagName('img').length} images and ${content.getElementsByTagName('object').length} objects and ${resources.length} resources`);
    }
}

function cleanHTML(content: HTMLDocument) {
    // TODO
}

export async function dumpNote(note: Note, options: EnexDumperOptions): Promise<string> {
    let str = `<note>
          <title>${note.title}</title>\n`;

    const resourcePromises: Promise<string>[] = [];
    if (note.resources) {
        for (const resource of note.resources) {
            resourcePromises.push(dumpResource(resource, options));
        }
    }
    const resourceStrings = await Promise.all(resourcePromises);

    const content = note.content;
    if (content) {
        if (note.resources) {
            replaceResources(content, note.resources, options);
        }
        cleanHTML(content);

        str += `  <content>
                <![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
                <en-note>
                ${content.body.innerHTML}
                <en-note>
                ]]>
            </content>\n`
    }
    if (note.created) {
        str += `  <created>${format(note.created, options.dateFormat)}</created>\n`;
    }
    if (note.updated) {
        str += `  <updated>${format(note.updated, options.dateFormat)}</updated>\n`;
    }
    if (note.tags) {
        for (const tag of note.tags) {
            str += `  <tag>${tag}</tag>\n`;
        }
    }
    if (note.latitude || note.longitude || note.author) {
        str += ` <note-attributes>\n`;
        if (note.latitude) {
            str += `    <latitude>${note.latitude}</latitude>\n`;
        }
        if (note.longitude) {
            str += `    <longitude>${note.longitude}</longitude>\n`;
        }
        if (note.author) {
            str += `    <author>${note.author}</author>\n`;
        }
        str += `  </note-attributes>\n`;
    }
    if (note.resources) {
        for (const resourceString of resourceStrings)
            str += resourceString;
    }
    str += `</note>`;
    return str;
}

