export class EnexDumperOptions {
    constructor(
        public resources = true,
        public exportApplication = 'EnexDumper',
        public exportApplicationVersion = '0.0.1',
        public dateFormat = "yyyyMMdd'T'HHmmss'Z'"
    ) {
    }
}
