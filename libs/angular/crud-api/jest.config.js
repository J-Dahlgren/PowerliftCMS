module.exports = {
  name: "angular-crud-api",
  preset: "../../../jest.config.js",
  coverageDirectory: "../../../coverage/libs/angular/crud-api",
  snapshotSerializers: [
    "jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js",
    "jest-preset-angular/build/AngularSnapshotSerializer.js",
    "jest-preset-angular/build/HTMLCommentSerializer.js"
  ]
};
