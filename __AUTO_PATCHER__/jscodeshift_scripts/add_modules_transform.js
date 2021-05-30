/**
 * 
 * Adds modules to files in project
 */

const MODULES_TO_ADD = {
    "URL": {
        /*
            Returns true if "adderFunctions" should be run on this `Program` path
        */
        shouldRunAdderFunction: (j, programPath, filePath) => {
            const urlOccuredAsIdentifier = j(programPath).find(j.Identifier, {
                name: "URL"
            }).length !== 0;

            const excludeFiles = new Set([
                '__AUTO_PATCHER__/tmp/__AUTO_PATCHER_OUTPUT__/lib/__REACT_NATIVE_YTDL_CUSTOM_MODULES__/url/index.js',
                '__AUTO_PATCHER__/tmp/__AUTO_PATCHER_OUTPUT__/lib/__REACT_NATIVE_YTDL_CUSTOM_MODULES__/url/js/URL.js'
            ])

            if (!urlOccuredAsIdentifier || excludeFiles.has(filePath))
                return false;

            return true;
        },

        adderFunction: (j, programPath, filePath, moduleName) => {
            console.log('\x1b[33m%s\x1b[0m', `add_modules_transform.js: adding module "${moduleName}, filePath: ${filePath}`);

            const requireCall = j.callExpression(j.identifier("require"), [j.literal("./__REACT_NATIVE_YTDL_CUSTOM_MODULES__/url")]);
            const identifier = j.identifier("URL");
            const memberExpr = j.memberExpression(requireCall, identifier);
            const varDeclaration = j.variableDeclaration("const", [j.variableDeclarator(identifier, memberExpr)]);
            const newProgramPath = j.program(programPath.node.body);
            newProgramPath.body.unshift(varDeclaration);

            j(programPath).replaceWith((path) => {
                return newProgramPath
            });
        },
    },
};

module.exports = function (fileInfo, api, options) {

    const j = api.jscodeshift;

    console.log(`add_modules_transform.js: processing "${fileInfo.path}"`)

    return j(fileInfo.source)
        .find(j.Program)
        .forEach((path) => {
            for (const o of Object.keys(MODULES_TO_ADD)) {
                const [k, v] = [o, MODULES_TO_ADD[o]];

                if (v.shouldRunAdderFunction(j, path, fileInfo.path)) {
                    v.adderFunction(j, path, fileInfo.path, k);
                }
            }
        })
        .toSource();
};