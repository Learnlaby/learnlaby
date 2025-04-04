// import { getServerSession } from 'next-auth/next'
// // import { testApiHandler } from '../__tests__/api-test-utils'
// import { testApiHandler } from './api-test-utils';


// describe('Authentication', () => {
//   it('rejects unauthenticated requests', async () => {
//     jest.mocked(getServerSession).mockResolvedValueOnce(null)
    
//     const response = await testApiHandler({
//       handler: require('@/app/api/classroom/route.ts').POST,
//       requestPatcher: req => (req.headers = {}),
//       test: async ({ fetch }) => {
//         const res = await fetch({ method: 'POST' })
//         expect(res.status).toBe(401)
//       }
//     })
//   })
// })

// __tests__/auth.test.ts
import { getServerSession } from 'next-auth/next';
import { testApiHandler } from './api-test-utils';

// Mock next-auth at the top level
jest.mock('next-auth', () => ({
  ...jest.requireActual('next-auth'),
  CredentialsProvider: jest.fn(() => ({
    id: 'credentials',
    name: 'Credentials',
    authorize: jest.fn(),
  })),
}));

jest.mock('next-auth/providers/credentials');

describe('Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects unauthenticated requests', async () => {
    // Mock getServerSession to return null (unauthenticated)
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    await testApiHandler({
      handler: require('@/app/api/classroom/route').POST,
      requestPatcher: (req) => {
        req.headers = {};
      },
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'POST' });
        expect(response.status).toBe(401);
      },
    });
  });

  it('allows authenticated requests', async () => {
    // Mock getServerSession to return a user (authenticated)
    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: { email: 'test@example.com' },
    });

    await testApiHandler({
      handler: require('@/app/api/classroom/route').POST,
      requestPatcher: (req) => {
        req.headers = {};
      },
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'POST' });
        // Adjust this expectation based on your API's success response
        expect(response.status).not.toBe(401);
      },
    });
  });
});