class FileSystem {
    constructor() {
        this.storage = window.localStorage;
        this.files = JSON.parse(this.storage.getItem('files')) || {};
        this.serializedFiles = JSON.stringify(this.files);
        this.fileList = Object.keys(this.files).join('\n');
    }

    createFile(name, content = '') {
        if (!this.isValidFileName(name)) {
            throw new Error('Invalid file name');
        }

        if (this.fileExists(name)) {
            throw new Error('File already exists');
        }

        this.files[name] = content;
        this.serializedFiles = JSON.stringify(this.files);
        this.saveFiles();
    }

    deleteFile(name) {
        if (!this.isValidFileName(name)) {
            throw new Error('Invalid file name');
        }

        if (!this.fileExists(name)) {
            throw new Error('File not found');
        }

        delete this.files[name];
        this.serializedFiles = JSON.stringify(this.files);
        this.saveFiles();
    }

    readFile(name) {
        if (!this.isValidFileName(name)) {
            throw new Error('Invalid file name');
        }

        if (!this.fileExists(name)) {
            throw new Error('File not found');
        }

        return this.files[name];
    }

    writeFile(name, content) {
        if (!this.isValidFileName(name)) {
            throw new Error('Invalid file name');
        }

        if (!this.fileExists(name)) {
            throw new Error('File not found');
        }

        this.files[name] = content;
        this.serializedFiles = JSON.stringify(this.files);
        this.saveFiles();
    }

    saveFiles() {
        this.storage.setItem('files', this.serializedFiles);
    }

    getFileList() {
        return this.fileList;
    }

    isValidFileName(name) {
        const forbiddenChars = /[^\w\d-_]/;
        return !forbiddenChars.test(name);
    }

    fileExists(name) {
        return name in this.files;
    }
}

const IO = new FileSystem();