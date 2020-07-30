module.exports = {
  name: "angular-menu",
  preset: "../../../jest.config.js",
  coverageDirectory: "../../../coverage/libs/angular/menu",
  snapshotSerializers: [
    "jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js",
    "jest-preset-angular/build/AngularSnapshotSerializer.js",
    "jest-preset-angular/build/HTMLCommentSerializer.js"
  ]
};
