const FormData = require('form-data');

const InvalidArgumentError = require('./errors/InvalidArgumentError');

const formatFileParam = require('./formatFileParam');
const getFileStream = require('./getFileStream');
const request = require('./request');

const appendFile = (data, keyName) => async ({ content, filename, contentType }) => {
    const stream = await getFileStream(content);

    data.append(keyName, stream, { filename, contentType });
}

/**
 * Class Message
 */
class Message {
    /**
     * Message constructor.
     * @param {string} content Message text
     * @param {string} title Message title
     * @param {string} priority Priority
     * @param {string} level Level
     */
    constructor(content = '', title = '', priority = Message.PRIORITY_NORMAL, level = Message.LEVEL_INFO) {
        /** @var string */
        this._title = null;
        /** @var string */
        this._content = null;
        /** @var string */
        this._priority = null;
        /** @var string */
        this._level = null;
        //
        /** @var array */
        this._files = [];
        /** @var array */
        this._images = [];

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

        if (this._title) {
            data.append('title', this._title);
        }        
        data.append('content', this._content);
        data.append('priority', this._priority);
        data.append('level', this._level);

        if (this._images.length > 0 || this._files.length > 0) {
            await Promise.all([
                ...this._images.map(appendFile(data, 'images[]')),
                ...this._files.map(appendFile(data, 'files[]'))
            ]);
        }
        
        await request({
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
        this._title = title;

        return this;
    }

    /**
     * Returns the value of the Title property.
     *
     * @returns {string}
     */
    getTitle() {
        return this._title;
    }

    /**
     * Sets the value of the Content property.
     *
     * @param {string} content Message content
     * @returns {Message}
     */
    setContent(content) {
        this._content = content;

        return this;
    }

    /**
     * Returns the value of the Content property.
     *
     * @returns {string}
     */
    getContent() {
        return this._content;
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

        this._priority = priority;

        return this;
    }

    /**
     * Returns the value of the Priority property.
     *
     * @returns {string}
     */
    getPriority() {
        return this._priority;
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

        this._level = level;

        return this;
    }

    /**
     * Returns the value of the Level property.
     *
     * @returns string
     */
    getLevel() {
        return this._level;
    }
    
    /**
     * Adds a new File to the message attached images list.
     *
     * @param {string|Buffer|Stream} file Local file path or remote URL or stream or buffer
     * @param {string} [filename] Attachment file name
     * @param {string} [contentType] Attachment file Mime-Type
     * @returns {Message}
     * @throws InvalidArgumentError
     */
    addFile(file, filename = 'file.dat', contentType= 'application/octet-stream') {
        this._files.push(formatFileParam(file, filename, contentType));

        return this;
    }

    /**
     * Adds a new Image to the message attached images list.
     *
     * @param {string|Buffer|Stream} image Local file path or remote URL or stream or buffer
     * @param {string} [filename] Attachment file name
     * @param {string} [contentType] Attachment file Mime-Type
     * @returns {Message}
     * @throws InvalidArgumentError
     */
    addImage(image, filename = 'file.dat', contentType= 'application/octet-stream') {
        this._images.push(formatFileParam(image, filename, contentType));

        return this;
    }
}

module.exports = Message;
