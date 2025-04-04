const { FormData } = require("formdata-node");
const { File } = require("formdata-node");

global.FormData = FormData;
global.File = File;

process.env.NODE_ENV = "test"; // Ensure test environment

// Setup proper mocking
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
}));


// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn().mockResolvedValue({
    user: { id: 'test-user-id' }
  })
}));


// Mock @auth/prisma-adapter
jest.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: jest.fn().mockReturnValue({})
}));


// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  genSalt: jest.fn().mockResolvedValue('salt')
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue("hashed_password"),
  genSalt: jest.fn().mockResolvedValue("salt"),
}));
