/**
 * A minimal working polyfill of miniget that doesn't use node's streaming api
 */

const retryStatusCodes = new Set([429, 503]);

const miniget = (url, reqOptions = {}) => {

    const fetchOptions = { ...reqOptions };
    fetchOptions.headers = {
        "Content-Type": 'text/plain;charset=UTF-8',
        ...fetchOptions.headers,
    }

    const fetchPromiseText = fetch(url, fetchOptions)
        .then(res => {
            if(retryStatusCodes.has(res.status)){
                throw Error(`Error: Status code: ${res.status}`)
            }

            return res;
        })
        .then(res => res.text())

    return {
        on: (event, callback) => {
            switch (event) {
                case 'data': fetchPromiseText.then(callback); break;
                case 'error': fetchPromiseText.catch(callback); break;
                case 'end': fetchPromiseText.finally(callback); break;

                default:
                    console.warn(`react-native-ytdl: miniget: unknown event listener received: ${event}`)
            }
        },
        setEncoding: () => {
            console.warn(`react-native-ytdl: miniget: will not use specified encoding since request has already been made. Currently using utf8 encoding.`)
        },
        text: () => {
            return fetchPromiseText
        }
    };
}

miniget.MinigetError = class MinigetError extends Error {
    constructor(message) {
        super(message);
    }
}

miniget.defaultOptions = {
    maxRedirects: 10,
    maxRetries: 5,
    maxReconnects: 0,
    backoff: { inc: 100, max: 10000 },
}

module.exports = miniget
