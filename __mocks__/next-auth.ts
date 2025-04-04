export const getServerSession = jest.fn(() => ({
    user: { email: 'test@example.com' },
    expires: new Date(Date.now() + 3600).toISOString()
  }))