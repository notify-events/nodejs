
const FormData = require('form-data');
const fs       = require('fs');

class Message {

    static get PRIORITY_LOWEST()  { return 'lowest';  }
    static get PRIORITY_LOW()     { return 'low';     }
    static get PRIORITY_NORMAL()  { return 'normal';  }
    static get PRIORITY_HIGH()    { return 'high';    }
    static get PRIORITY_HIGHEST() { return 'highest'; }

    static get LEVEL_VERBOSE() { return 'verbose'; }
    static get LEVEL_INFO()    { return 'info';    }
    static get LEVEL_NOTICE()  { return 'notice';  }
    static get LEVEL_WARNING() { return 'warning'; }
    static get LEVEL_ERROR()   { return 'error';   }
    static get LEVEL_SUCCESS() { return 'success'; }

    constructor(content, title, priority, level) {
        this._form = new FormData();

        this.setContent(content   ?? '');
        this.setTitle(title       ?? '');
        this.setPriority(priority ?? Message.PRIORITY_NORMAL);
        this.setLevel(level       ?? Message.LEVEL_INFO);
    }

    send(token, callback) {
        this._form.submit('https://notify.events/api/v1/channel/source/' + token + '/execute', (err, res) => {
            res.resume();

            callback();
        });
    }

    setTitle(title) {
        this._form.set('title', title);
    }

    getTitle() {
        return this._form.get('title');
    }

    setContent(content) {
        this._form.set('content', content);
    }

    getContent() {
        return this._form.get('content');
    }

    setPriority(priority) {
        const priorities = [
            Message.PRIORITY_LOWEST,
            Message.PRIORITY_LOW,
            Message.PRIORITY_NORMAL,
            Message.PRIORITY_HIGH,
            Message.PRIORITY_HIGHEST
        ];

        if (!priorities.includes(priority)) {
            throw new Error('Invalid priority value!');
        }

        this._form.set('priority', priority);
    }

    getPriority() {
        return this._form.get('priority');
    }

    setLevel(level) {
        const levels = [
            Message.LEVEL_VERBOSE,
            Message.LEVEL_INFO,
            Message.LEVEL_NOTICE,
            Message.LEVEL_WARNING,
            Message.LEVEL_ERROR,
            Message.LEVEL_SUCCESS
        ];

        if (!levels.includes(level)) {
            throw new Error('Invalid level value!');
        }

        this._form.set('level', level);
    }

    getLevel() {
        return this._form.get('level');
    }

    addFile(filePath, fileName, mimeType) {
        const file = fs.createReadStream(filePath);

        this._form.append('file[]', file, {
            fileName:    fileName,
            contentType: mimeType ?? 'application/octet-stream'
        });
    }

    addFileFromContent(content, fileName, mimeType) {
        this._form.append('file[]', content, {
            fileName:    fileName ?? 'file.dat',
            contentType: mimeType ?? 'application/octet-stream'
        });
    }

    addImage(filePath, fileName, mimeType) {
        const image = fs.createReadStream(filePath);

        this._form.append('image[]', image, {
            fileName:    fileName,
            contentType: mimeType,
        });
    }

    addImageFromContent(content, fileName, mimeType) {
        this._form.append('image[]', content, {
            fileName:    fileName,
            contentType: mimeType
        });
    }

}

exports = module.exports = Message;
