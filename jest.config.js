module.exports = {
    preset: 'ts-jest',
    testRegex: './test/.*\\.test\\.(js|ts)$',
    maxWorkers: 2,
    moduleDirectories: ["node_modules"],
    moduleNameMapper: {
        "src/(.*)": "<rootDir>/src/$1",
    }
};
