const { isURL } = require('validator');
/**
 *
 * @param {string} url Url
 * @returns {boolean}
 */
const validateUrl = url => isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    allow_underscores: true,
    disallow_auth: true
});

module.exports = validateUrl;
