module.exports = {
  name: "angular-socket",
  preset: "../../../jest.config.js",
  coverageDirectory: "../../../coverage/libs/angular/socket",
  snapshotSerializers: [
    "jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js",
    "jest-preset-angular/build/AngularSnapshotSerializer.js",
    "jest-preset-angular/build/HTMLCommentSerializer.js"
  ]
};
