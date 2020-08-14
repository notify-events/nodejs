const axios = require('axios');
const Agent = require('agentkeepalive');
const FormData = require('form-data');

const request = options => {
    const instance = axios.create();

    const keepAliveAgent = new Agent({
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        maxSockets: 100,
        maxFreeSockets: 10,
        timeout: 60000, // active socket keepalive for 60 seconds
        freeSocketTimeout: 30000 // free socket keepalive for 30 seconds
    });

    const opts = { ...options, httpAgent: keepAliveAgent };

    if (options.data instanceof FormData) {
        Object.assign(opts, {
            headers: {
                ...(options.headers || {}),
                ...options.data.getHeaders()
            }
        });
    }

    return instance(opts);
};

module.exports = request;
