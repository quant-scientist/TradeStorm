const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Increase the maximum number of workers
config.maxWorkers = 4;

// Increase the maximum file size
config.transformer.maxWorkers = 4;
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// Increase the maximum number of file watchers
config.watchFolders = [__dirname];
config.watchman = {
  watchman: true,
  watchmanIgnore: ['**/node_modules/**', '**/.git/**'],
};

module.exports = config; 