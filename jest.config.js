const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to Next.js app
  dir: './',
})

const customJestConfig = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/$1',
    // '^@/app/(.*)$': '<rootDir>/src/app/$1',
    // '^@/public/(.*)$': '<rootDir>/public/$1',
    // '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
    // '^@/(.*)$': './app/$1',
    // '^next-auth/providers/credentials$': '<rootDir>/__mocks__/next-auth.ts',
    '^next-auth$': '<rootDir>/__mocks__/next-auth.ts',
    '^next-auth/providers/credentials$': '<rootDir>/__mocks__/next-auth.ts',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testEnvironment: 'node',
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
    // '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(formdata-node)/)'
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
module.exports = createJestConfig(customJestConfig)