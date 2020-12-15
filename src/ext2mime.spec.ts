import './ext2mime';
import ext2mime from './ext2mime';

it('works to convert extension with dot', () => {
    expect(ext2mime('.pdf')).toEqual("application/pdf");
});

it('works to convert extension with dot', () => {
    expect(ext2mime('jpg')).toEqual("image/jpeg");
});

it('works to get a default extension for unknown extension', () => {
    expect(ext2mime('.xyz')).toEqual("application/octet-stream");
});
