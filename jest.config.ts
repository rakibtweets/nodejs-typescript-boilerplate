import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',

  testEnvironment: 'node',

  // Define the root directory for tests and modules
  roots: ['test'],

  // Use ts-jest to transform TypeScript files
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  // Regular expression to find test files
  testRegex: '((\\.|/)(test|spec))\\.ts?$',

  // File extensions to recognize in module resolution
  moduleFileExtensions: ['ts', 'js']
};

export default config;
