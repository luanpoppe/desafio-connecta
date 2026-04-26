/** @type {import("jest").Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/test/**/*.test.ts", "**/test/**/*.test.tsx"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // DS `dist` is ESM-only; resolve source so ts-jest compiles it (no hand-written stub).
    "^@connecta/design-system$": "<rootDir>/../design-system/src/index.ts",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
        useESM: false,
      },
    ],
  },
};

export default config;
