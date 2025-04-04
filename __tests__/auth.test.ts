import { getServerSession } from 'next-auth/next'
import { testApiHandler } from '../__tests__/api-test-utils'

describe('Authentication', () => {
  it('rejects unauthenticated requests', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(null)
    
    const response = await testApiHandler({
      handler: require('@/app/api/classroom/route').POST,
      requestPatcher: req => (req.headers = {}),
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'POST' })
        expect(res.status).toBe(401)
      }
    })
  })
})