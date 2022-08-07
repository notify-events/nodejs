const FormData = require('form-data');

const InvalidArgumentError = require('./errors/InvalidArgumentError');

const fs = require('fs');
const { Stream } = require('stream');
const { URL } = require('url');
const path = require('path');
const request = require('./request');
const validateUrl = require('./validateUrl');

/**
 *
 * @param {string} url
 * @returns {Promise<ReadStream>}
 */
const getFileByLink = async url => request({
    url,
    maxRedirects: 5,
    timeout: 10000,
    responseType: 'stream'
}).then(response => response.data);

const appendFile = (data, keyName) => async ({ file, filename, contentType }) => {
    let stream;

    if (typeof file === 'string') {
        if (validateUrl(file)) {
            stream = await getFileByLink(file);

            filename = filename || path.basename((new URL(file)).pathname);
        } else if (fs.existsSync(file)) {
            stream = fs.createReadStream(file);

            filename = filename || path.basename(file);
        } else {
            stream = Buffer.from(file);
        }
    } else if (file instanceof Stream || Buffer.isBuffer(file)) {
        stream = file;
    } else {
        throw new InvalidArgumentError('invalid file');
    }

    data.append(keyName, stream, { filename, contentType });
}

/**
 * Class Message
 */
class Message {
    #title;
    #content;
    #priority;
    #level;
    #files = [];
    #images = [];
    #actions = [];

    /**
     * Message constructor.
     * @param {string} content Message text
     * @param {string} title Message title
     * @param {string} priority Priority
     * @param {string} level Level
     */
    constructor(content = '', title = '', priority = Message.PRIORITY_NORMAL, level = Message.LEVEL_INFO) {
        this
            .setContent(content)
            .setTitle(title)
            .setPriority(priority)
            .setLevel(level);
    }

    static get PRIORITY_LOWEST() {
        return 'lowest';
    }

    static get PRIORITY_LOW() {
        return 'low';
    }

    static get PRIORITY_NORMAL() {
        return 'normal';
    }

    static get PRIORITY_HIGH() {
        return 'high';
    }

    static get PRIORITY_HIGHEST() {
        return 'highest';
    }

    static get LEVEL_VERBOSE() {
        return 'verbose';
    }

    static get LEVEL_INFO() {
        return 'info';
    }

    static get LEVEL_NOTICE() {
        return 'notice';
    }

    static get LEVEL_WARNING() {
        return 'warning';
    }

    static get LEVEL_ERROR() {
        return 'error';
    }

    static get LEVEL_SUCCESS() {
        return 'success';
    }

    /**
     * Sends the message to the specified channel.
     * You can get the source token when connecting the PHP source
     * to your channel on the Notify.Events service side.
     *
     * @param {string} token Source token
     * @returns {Promise<void>}
     */
    async send(token) {
        const data = new FormData();

        if (this.#title) {
            data.append('title', this.#title);
        }

        data.append('content',  this.#content);
        data.append('priority', this.#priority);
        data.append('level',    this.#level);

        if (this.#images.length > 0 || this.#files.length > 0) {
            await Promise.all([
                ...this.#images.map(appendFile(data, 'images[]')),
                ...this.#files.map(appendFile(data, 'files[]'))
            ]);
        }

        if (this.#actions.length > 0) {
            this.#actions.forEach(function (action, idx) {
                data.append('actions[' + idx + '][name]', action.name);
                data.append('actions[' + idx + '][title]', action.title);
                data.append('actions[' + idx + '][callback_url]', action.callback_url);
                data.append('actions[' + idx + '][callback_method]', action.callback_method);
                data.append('actions[' + idx + '][callback_content]', action.callback_content);

                for (const [key, value] of Object.entries(action.callback_headers)) {
                    data.append('actions[' + idx + '][callback_headers][' + encodeURI(key) + ']', value);
                }
            });
        }

        return await request({
            url: `https://notify.events/api/v1/channel/source/${token}/execute`,
            method: 'post',
            data
        });
    }

    /**
     * Sets the value of the Title property.
     *
     * @param {string} title Message title
     * @returns {Message}
     */
    setTitle(title) {
        this.#title = title;

        return this;
    }

    /**
     * Returns the value of the Title property.
     *
     * @returns {string}
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Sets the value of the Content property.
     *
     * @param {string} content Message content
     * @returns {Message}
     */
    setContent(content) {
        this.#content = content;

        return this;
    }

    /**
     * Returns the value of the Content property.
     *
     * @returns {string}
     */
    getContent() {
        return this.#content;
    }

    /**
     * Sets the value of the Priority property.
     * For recipients which supports priority, the message will be highlighted accordingly.
     * This method checks that $priority is in the list of available message priorities.
     *
     * @param {string} priority Message priority
     * @returns {Message}
     * @throws InvalidArgumentError
     */
    setPriority(priority) {
        if (![
            Message.PRIORITY_LOWEST,
            Message.PRIORITY_LOW,
            Message.PRIORITY_NORMAL,
            Message.PRIORITY_HIGH,
            Message.PRIORITY_HIGHEST,
        ].includes(priority)) {
            throw new InvalidArgumentError('Invalid priority value');
        }

        this.#priority = priority;

        return this;
    }

    /**
     * Returns the value of the Priority property.
     *
     * @returns {string}
     */
    getPriority() {
        return this.#priority;
    }

    /**
     * Sets the value of the Level property.
     * This method checks that level is in the list of available message levels.
     * For recipients which have differences in the display of messages at different levels, this level will be applied.
     *
     * @param {string} level Message Level
     * @returns {Message}
     * @throws InvalidArgumentError
     */
    setLevel(level) {
        if (![
            Message.LEVEL_VERBOSE,
            Message.LEVEL_INFO,
            Message.LEVEL_NOTICE,
            Message.LEVEL_WARNING,
            Message.LEVEL_ERROR,
            Message.LEVEL_SUCCESS
        ].includes(level)) {
            throw new InvalidArgumentError('Invalid level value');
        }

        this.#level = level;

        return this;
    }

    /**
     * Returns the value of the Level property.
     *
     * @returns string
     */
    getLevel() {
        return this.#level;
    }

    /**
     * Adds a new File to the message attached images list.
     *
     * @param {string|Buffer|Stream} file Local file path or remote URL or content or stream or buffer
     * @param {string} [filename] Attachment file name
     * @param {string} [contentType] Attachment file Mime-Type
     * @returns {Message}
     * @throws InvalidArgumentError
     */
    addFile(file, filename = 'file.dat', contentType= 'application/octet-stream') {
        this.#files.push({
            file: file,
            filename,
            contentType
        });

        return this;
    }

    /**
     * Adds a new Image to the message attached images list.
     *
     * @param {string|Buffer|Stream} image Local file path or remote URL or content or stream or buffer
     * @param {string} [filename] Attachment file name
     * @param {string} [contentType] Attachment file Mime-Type
     * @returns {Message}
     * @throws InvalidArgumentError
     */
    addImage(image, filename = 'file.dat', contentType= 'application/octet-stream') {
        this.#images.push({
            file: image,
            filename,
            contentType
        });

        return this;
    }

    /**
     * Adds a new Action to the message
     *
     * @param {string} name Action name
     * @param {string} title Action title (button title)
     * @param {string} [callback_url] Action callback URL
     * @param {string} [callback_method] Action callback method
     * @param {array} [callback_headers] Action callback headers
     * @param {string} [callback_content] Action callback content
     * @returns {Message}
     */
    addAction(name, title, callback_url = undefined, callback_method = 'get', callback_headers = [], callback_content = '') {
        if ((callback_url !== undefined) && !validateUrl(callback_url)) {
            throw new InvalidArgumentError('Invalid callback url');
        }

        this.#actions.push({
            name:             name,
            title:            title,
            callback_url:     callback_url,
            callback_method:  callback_method,
            callback_headers: callback_headers,
            callback_content: callback_content,
        });

        return this;
    }
}

module.exports = Message;
