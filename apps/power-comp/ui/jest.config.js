module.exports = {
  preset: "../../../jest.preset.js",
  coverageDirectory: "../../../coverage/apps/power-comp/ui",

  setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
      stringifyContentPathRegex: "\\.(html|svg)$",
      astTransformers: [
        "jest-preset-angular/build/InlineFilesTransformer",
        "jest-preset-angular/build/StripStylesTransformer",
      ],
    },
  },
  displayName: "power-comp-ui",
  snapshotSerializers: [
    "jest-preset-angular/build/serializers/no-ng-attributes",
    "jest-preset-angular/build/serializers/ng-snapshot",
    "jest-preset-angular/build/serializers/html-comment",
  ],
};
