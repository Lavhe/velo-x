module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '^velo-x/(.+)': './src/\\1',
        },
      },
    ],
  ],
};
