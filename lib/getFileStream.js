const fs = require('fs');

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
})
    .then(response => response.data);

/**
 * 
 * @param {string|Buffer|ReadStream} file
 * @returns {Promise<string|Buffer|ReadStream>}
 */
const getFileStream = async file => {
    if (typeof file === 'string') {
        if (validateUrl(file)) {
            return getFileByLink(file);
        }
        
        return fs.createReadStream(file);
    }

    return file;
};

module.exports = getFileStream;
