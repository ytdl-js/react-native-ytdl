/**
 * 
 * Redirects incompatible modules to custom implementations
 */

const CUSTOM_MODULE_IMPLEMENTATIONS = {
    "miniget": "./__REACT_NATIVE_YTDL_CUSTOM_MODULES__/miniget",
    "m3u8stream/dist/parse-time": "./__REACT_NATIVE_YTDL_CUSTOM_MODULES__/m3u8stream-parse-time",
    "sax": "./__REACT_NATIVE_YTDL_CUSTOM_MODULES__/sax"
};

module.exports = function (fileInfo, api, options) {

    const j = api.jscodeshift;

    console.log(`transform.js: processing "${fileInfo.path})"`)

    return j(fileInfo.source)
        .find(j.CallExpression)
        .forEach((path) => {
            if (path.value.callee.name !== "require") {
                return;
            }

            if (
                path.value.arguments.length === 0 ||
                !CUSTOM_MODULE_IMPLEMENTATIONS[path.value.arguments[0].value]
            ) {
                return;
            }

            console.log('\x1b[33m%s\x1b[0m', `transform.js: redirecting module "${path.value.arguments[0].value}" to "${CUSTOM_MODULE_IMPLEMENTATIONS[path.value.arguments[0].value]}"`);

            path.value.arguments[0].value = CUSTOM_MODULE_IMPLEMENTATIONS[path.value.arguments[0].value];

            j(path).replaceWith(path.node);
        })
        .toSource();
};