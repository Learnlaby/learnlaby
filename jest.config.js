// module.exports = {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//     moduleNameMapper: {
//       '^@/(.*)$': '<rootDir>/src/$1',
//       '^next-auth/providers/credentials$': '<rootDir>/__mocks__/next-auth.ts'
//     }
//   }

// // jest.config.ts
// export default {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     moduleFileExtensions: ['ts', 'js', 'json'],
//     testMatch: ['**/__tests__/**/*.test.ts'],
//     moduleNameMapper: {
//       '^@/(.*)$': '<rootDir>/$1', // to support your @/app/api path aliases
//     },
//     transform: {
//       '^.+\\.ts$': 'ts-jest',
//     },
//   }
  
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(formdata-node)/)'
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
module.exports = createJestConfig(customJestConfig)