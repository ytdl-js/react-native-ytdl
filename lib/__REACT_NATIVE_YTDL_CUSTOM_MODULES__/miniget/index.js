/**
 * A minimal working polyfill of miniget that doesn't use node's streaming api
 * 
 * @param {string} url
 * @param {Object} reqOptions
 * @return {number}
 */

const miniget = (url, reqOptions = {}) => {

    const fetchOptions = { ...reqOptions };
    fetchOptions.headers = {
        "Content-Type": 'text/plain;charset=UTF-8',
        ...(fetchOptions.headers || {}),
    }

    const fetchPromiseText = fetch(url, fetchOptions)
        .then(res => res.text())

    return {
        on: (event, callback) => {
            switch (event) {
                case 'chunk': fetchPromiseText.then(callback); break;
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

module.exports = miniget
