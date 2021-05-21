import './js/ios10Fix';

import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';

export * from './js/URL';
export * from './js/URLSearchParams';

export function setupURLPolyfill() {
  global.REACT_NATIVE_URL_POLYFILL = `react-native-url-polyfill@1.3.0`;

  polyfillGlobal('URL', () => require('./js/URL').URL);
  polyfillGlobal(
    'URLSearchParams',
    () => require('./js/URLSearchParams').URLSearchParams,
  );
}

setupURLPolyfill();
module.exports = {
  URL,
  URLSearchParams
}