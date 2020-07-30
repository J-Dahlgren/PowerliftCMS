module.exports = {
  name: "nest-util",
  preset: "../../../jest.config.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "html"],
  coverageDirectory: "../../../coverage/libs/nest/util"
};
