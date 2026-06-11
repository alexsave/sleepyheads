/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const exclusionList = require('metro-config/src/defaults/exclusionList');
module.exports = {
  transformer: {
    // aws-amplify v6 ships modern syntax (optional chaining) in some deps; the
    // default uglify minifier can't parse it, so use terser for release builds.
    minifierPath: 'metro-minify-terser',
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    blacklistRE: exclusionList([/#current-cloud-backend\/.*/])
  }
};
