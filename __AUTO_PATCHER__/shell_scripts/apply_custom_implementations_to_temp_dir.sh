#!/bin/sh

# copy custom modules and apply file replacements
mkdir "__AUTO_PATCHER__/tmp/__AUTO_PATCHER_OUTPUT__/"
cp -r "__AUTO_PATCHER__/tmp/node-ytdl-core/lib" "__AUTO_PATCHER__/tmp/__AUTO_PATCHER_OUTPUT__/"
cp -r "__AUTO_PATCHER__/__REACT_NATIVE_YTDL_CUSTOM_FILES__/lib/__REACT_NATIVE_YTDL_CUSTOM_MODULES__/" "__AUTO_PATCHER__/__REACT_NATIVE_YTDL_CUSTOM_FILES__/lib/index.js" "__AUTO_PATCHER__/tmp/__AUTO_PATCHER_OUTPUT__/lib/"
cp "__AUTO_PATCHER__/__REACT_NATIVE_YTDL_CUSTOM_FILES__/index.js" "__AUTO_PATCHER__/__REACT_NATIVE_YTDL_CUSTOM_FILES__/README.md" "__AUTO_PATCHER__/tmp/__AUTO_PATCHER_OUTPUT__"

# polyfill dependencies
jscodeshift -t __AUTO_PATCHER__/jscodeshift_scripts/use_custom_module_implementations_transform.js __AUTO_PATCHER__/tmp/__AUTO_PATCHER_OUTPUT__/

# change warning to react-native-ytdl equivalent
jscodeshift -t __AUTO_PATCHER__/jscodeshift_scripts/change_update_warning_transform.js __AUTO_PATCHER__/tmp/__AUTO_PATCHER_OUTPUT__/lib/utils.js

# add new modules
jscodeshift -t __AUTO_PATCHER__/jscodeshift_scripts/add_modules_transform.js __AUTO_PATCHER__/tmp/__AUTO_PATCHER_OUTPUT__/
