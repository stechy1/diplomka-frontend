module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/stim-lib-asset-player',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  displayName: 'stim-lib-asset-player',
};
