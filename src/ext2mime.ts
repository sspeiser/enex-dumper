export default function ext2mime(ext: string): string {
    if (!ext.startsWith('.')) {
        ext = '.' + ext;
    }
    return mapping[ext] || "application/octet-stream";
}

const mapping: { [key: string]: string } = {
    ".aac": "audio/x-aac",
    ".avi": "video/x-msvideo",
    ".bmp": "image/bmp",
    ".bz": "application/x-bzip",
    ".bz2": "application/x-bzip2",
    ".csv": "text/csv",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".dvi": "application/x-dvi",
    ".eps": "application/postscript",
    ".epub": "application/epub+zip",
    ".gif": "image/gif",
    ".gz": "application/x-gzip",
    ".htm": "text/html",
    ".html": "text/html",
    ".jar": "application/java-archive",
    ".java": "text/x-java-source",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "application/javascript",
    ".json": "application/json",
    ".kml": "application/vnd.google-earth.kml+xml",
    ".kmz": "application/vnd.google-earth.kmz",
    ".mid": "audio/midi",
    ".midi": "audio/midi",
    ".mime": "message/rfc822",
    ".mov": "video/quicktime",
    ".mp2": "audio/mpeg",
    ".mp2a": "audio/mpeg",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".mp4a": "audio/mp4",
    ".mp4v": "video/mp4",
    ".mpeg": "video/mpeg",
    ".mpg": "video/mpeg",
    ".mpg4": "video/mp4",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".pot": "application/vnd.ms-powerpoint",
    ".potx": "application/vnd.openxmlformats-officedocument.presentationml.template",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".ps": "application/postscript",
    ".rar": "application/x-rar-compressed",
    ".rss": "application/rss+xml",
    ".rtf": "application/rtf",
    ".svg": "image/svg+xml",
    ".svgz": "image/svg+xml",
    ".tar": "application/x-tar",
    ".text": "text/plain",
    ".tgz": "application/x-gzip",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
    ".txt": "text/plain",
    ".xhtml": "application/xhtml+xml",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xml": "text/xml",
    ".zip": "application/zip"
};