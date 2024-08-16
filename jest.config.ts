import { createDefaultEsmPreset, type JestConfigWithTsJest } from 'ts-jest'

const config:JestConfigWithTsJest = {
  transform: {
    ...createDefaultEsmPreset().transform,
  },
  passWithNoTests:true,
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Map .js to base path without extension
  },
};

export default config