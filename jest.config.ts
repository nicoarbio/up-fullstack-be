import type { Config } from 'jest';
import { parse } from "jsonc-parser";
import fs from "fs";

const tsconfig = parse(fs.readFileSync('tsconfig.json', 'utf-8'));
const tsPaths = tsconfig.compilerOptions.paths || {};

const aliases: Record<string, string> = {};

for (const alias in tsPaths) {
    const cleanAlias = alias.replace('/*', '')
    const target = tsPaths[alias][0]
        .replace('/*', '') // sacamos src/ para que empiece en app/...
    aliases[`^${cleanAlias}/(.*)$`] = `<rootDir>/${target}/$1`;
}
/*  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@model/(.*)$': '<rootDir>/src/model/$1'
  },*/
const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: './src/test/config/global-setup.ts',
    globalTeardown: './src/test/config/global-teardown.ts',
    setupFilesAfterEnv: ['./src/test/config/test-setup.ts'],
    moduleNameMapper: aliases,
    moduleDirectories: ['node_modules', 'src'],
    testMatch: ['**/*.test.ts'],
};

export default config;
