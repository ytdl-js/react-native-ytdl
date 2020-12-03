/**
 * 
 * Changes the "outdated ytdl-core" warning to react-native-ytdl equivalent
 */


module.exports = function (fileInfo, api, options) {

    const j = api.jscodeshift;

    console.log(`change_update_warning_transform.js: processing "${fileInfo.path}"`)

    return j(fileInfo.source)
        .find(j.Literal)
        .forEach((path) => {
            const literalValue = path.value.value;
            if (typeof literalValue !== "string") return;
            if (!/npm install ytdl-core\@latest/g.test(literalValue)) return;

            const newUpdateWarning = `\x1b[33mWARNING:\x1B[0m react-native-ytdl is out of date! If the latest port is available, update with "npm install react-native-ytdl@latest".`;

            j(path).replaceWith(j.literal(newUpdateWarning));
        })
        .toSource();
};