module.exports = {
  name: "nest-entity-service",
  preset: "../../../jest.config.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "html"],
  coverageDirectory: "../../../coverage/libs/nest/entity-service"
};
