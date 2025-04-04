// import { FormData } from 'formdata-node'
// import { File } from 'formdata-node'

// global.FormData = FormData
// global.File = File

// process.env.NODE_ENV = 'test' // Ensure test environment

// const { FormData } = require('formdata-node');
// const { File } = require('formdata-node');

// global.FormData = FormData;
// global.File = File;

// process.env.NODE_ENV = 'test'; // Ensure test environment

const { FormData } = require('formdata-node');
const { File } = require('formdata-node');

global.FormData = FormData;
global.File = File;

process.env.NODE_ENV = 'test'; // Ensure test environment

// Setup proper mocking
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}));

// Mock other dependencies as needed

