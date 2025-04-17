const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Increase the maximum number of workers
config.maxWorkers = 2;

// Configure transformer
config.transformer.maxWorkers = 2;
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// Configure resolver
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

// Configure server
config.server.port = 8081;
config.server.enableVisualizer = false;

module.exports = config; 