export = Message;
/**
 * Class Message
 */
declare class Message {
    static get PRIORITY_LOWEST(): string;
    static get PRIORITY_LOW(): string;
    static get PRIORITY_NORMAL(): string;
    static get PRIORITY_HIGH(): string;
    static get PRIORITY_HIGHEST(): string;
    static get LEVEL_VERBOSE(): string;
    static get LEVEL_INFO(): string;
    static get LEVEL_NOTICE(): string;
    static get LEVEL_WARNING(): string;
    static get LEVEL_ERROR(): string;
    static get LEVEL_SUCCESS(): string;
    /**
     * Message constructor.
     * @param {string} content Message text
     * @param {string} title Message title
     * @param {string} priority Priority
     * @param {string} level Level
     */
    constructor(content?: string, title?: string, priority?: string, level?: string);
    /**
     * Sends the message to the specified channel.
     * You can get the source token when connecting the PHP source
     * to your channel on the Notify.Events service side.
     *
     * @param {string} token Source token
     * @returns {Promise<void>}
     */
    send(token: string): Promise<void>;
    /**
     * Sets the value of the Title property.
     *
     * @param {string} title Message title
     * @returns {Message}
     */
    setTitle(title: string): Message;
    /**
     * Returns the value of the Title property.
     *
     * @returns {string}
     */
    getTitle(): string;
    /**
     * Sets the value of the Content property.
     *
     * @param {string} content Message content
     * @returns {Message}
     */
    setContent(content: string): Message;
    /**
     * Returns the value of the Content property.
     *
     * @returns {string}
     */
    getContent(): string;
    /**
     * Sets the value of the Priority property.
     * For recipients which supports priority, the message will be highlighted accordingly.
     * This method checks that $priority is in the list of available message priorities.
     *
     * @param {string} priority Message priority
     * @returns {Message}
     * @throws InvalidArgumentError
     */
    setPriority(priority: string): Message;
    /**
     * Returns the value of the Priority property.
     *
     * @returns {string}
     */
    getPriority(): string;
    /**
     * Sets the value of the Level property.
     * This method checks that level is in the list of available message levels.
     * For recipients which have differences in the display of messages at different levels, this level will be applied.
     *
     * @param {string} level Message Level
     * @returns {Message}
     * @throws InvalidArgumentError
     */
    setLevel(level: string): Message;
    /**
     * Returns the value of the Level property.
     *
     * @returns string
     */
    getLevel(): any;
    /**
     * Adds a new File to the message attached images list.
     *
     * @param {string|Buffer|Stream} file Local file path or remote URL or content or stream or buffer
     * @param {string} [filename] Attachment file name
     * @param {string} [contentType] Attachment file Mime-Type
     * @returns {Message}
     * @throws InvalidArgumentError
     */
    addFile(file: string | Buffer | Stream, filename?: string, contentType?: string): Message;
    /**
     * Adds a new Image to the message attached images list.
     *
     * @param {string|Buffer|Stream} image Local file path or remote URL or content or stream or buffer
     * @param {string} [filename] Attachment file name
     * @param {string} [contentType] Attachment file Mime-Type
     * @returns {Message}
     * @throws InvalidArgumentError
     */
    addImage(image: string | Buffer | Stream, filename?: string, contentType?: string): Message;
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
    addAction(name: string, title: string, callback_url?: string, callback_method?: string, callback_headers?: any[], callback_content?: string): Message;
    #private;
}
import { Stream } from "stream";
//# sourceMappingURL=Message.d.ts.map