/**
 * 
 * Redirects incompatible modules to custom implementations
 */

const CUSTOM_MODULE_IMPLEMENTATIONS = {
    "miniget": "./__REACT_NATIVE_YTDL_CUSTOM_MODULES__/miniget",
    "m3u8stream": "./__REACT_NATIVE_YTDL_CUSTOM_MODULES__/m3u8stream",
    "sax": "./__REACT_NATIVE_YTDL_CUSTOM_MODULES__/sax",
    "timers": "./__REACT_NATIVE_YTDL_CUSTOM_MODULES__/timers",
    "url": "./__REACT_NATIVE_YTDL_CUSTOM_MODULES__/url",
};

module.exports = function (fileInfo, api, options) {

    const j = api.jscodeshift;

    console.log(`use_custom_module_implementations_transform.js: processing "${fileInfo.path}"`)

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

            console.log('\x1b[33m%s\x1b[0m', `use_custom_module_implementations_transform.js: redirecting module "${path.value.arguments[0].value}" to "${CUSTOM_MODULE_IMPLEMENTATIONS[path.value.arguments[0].value]}"`);

            path.value.arguments[0].value = CUSTOM_MODULE_IMPLEMENTATIONS[path.value.arguments[0].value];

            j(path).replaceWith(path.node);
        })
        .toSource();
};