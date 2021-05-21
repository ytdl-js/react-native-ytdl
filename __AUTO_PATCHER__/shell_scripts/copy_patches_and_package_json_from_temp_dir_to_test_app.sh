#!/bin/sh

# copy patches and package.json to test app directory
cp -r "__AUTO_PATCHER__/tmp/__AUTO_PATCHER_OUTPUT__/"* "./react_native_ytdl_test_app/node_modules/react-native-ytdl/"
cp "package.json" "./react_native_ytdl_test_app/node_modules/react-native-ytdl/package.json"