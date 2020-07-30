module.exports = {
  name: "nest-push-bullet",
  preset: "../../../jest.config.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "html"],
  coverageDirectory: "../../../coverage/libs/nest/push-bullet"
};
