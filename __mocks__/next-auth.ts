// __mocks__/next-auth.ts
const mockSession = {
  user: { name: 'Test User', email: 'test@example.com' },
  expires: '2023-12-31T00:00:00.000Z'
};

export const getServerSession = jest.fn(() => Promise.resolve(mockSession));
export const getSession = jest.fn(() => Promise.resolve(mockSession));
export const useSession = jest.fn(() => ({ data: mockSession, status: 'authenticated' }));

const CredentialsProvider = jest.fn(() => ({
  id: 'credentials',
  name: 'Credentials',
  authorize: jest.fn(() => Promise.resolve(mockSession.user))
}));

export const authOptions = {
  providers: [CredentialsProvider()],
  callbacks: {
    jwt: jest.fn(),
    session: jest.fn()
  }
};

export default {
  getServerSession,
  getSession,
  useSession,
  CredentialsProvider,
  authOptions
};