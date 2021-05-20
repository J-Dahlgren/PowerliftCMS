module.exports = {
  preset: "../../jest.preset.js",
  coverageDirectory: "../../coverage/libs/angular",

  setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.spec.json",
      stringifyContentPathRegex: "\\.(html|svg)$",
      astTransformers: [
        "jest-preset-angular/build/InlineFilesTransformer",
        "jest-preset-angular/build/StripStylesTransformer",
      ],
    },
  },
  displayName: "angular",
  snapshotSerializers: [
    "jest-preset-angular/build/serializers/no-ng-attributes",
    "jest-preset-angular/build/serializers/ng-snapshot",
    "jest-preset-angular/build/serializers/html-comment",
  ],
};
