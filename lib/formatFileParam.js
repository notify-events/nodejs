const fs = require('fs');
const { Stream } = require('stream');
const path = require('path');
const { URL } = require('url');

const validateUrl = require('./validateUrl');
const InvalidArgumentError = require('./errors/InvalidArgumentError');

/**
 *
 * @param {string|Buffer|ReadStream} file Local file path or remote URL or stream or buffer
 * @param {string} filename Attachment file name
 * @param {string} contentType Attachment file Mime-Type
 * @returns {{fileName: string, mimeType: string, content: (string|Buffer|ReadStream)}}
 * @throws InvalidArgumentError
 */
const formatFileParam = (file, filename = 'file.dat', contentType= 'application/octet-stream') => {
    if (typeof file === 'string') {
        if (validateUrl(file)) {
            return {
                content: file,
                filename: filename || path.basename((new URL(file)).pathname),
                contentType
            };
        }
        
        if (fs.existsSync(file)) {
            return {
                content: file,
                filename: filename || path.basename(file),
                contentType
            };
        }
    }

    if (file instanceof Stream || Buffer.isBuffer(file)) {
        return {
            content: file,
            filename,
            contentType
        };
    }

    throw new InvalidArgumentError('invalid file');
};


module.exports = formatFileParam;
