import { NextApiRequest, NextApiResponse } from 'next'
import { createMocks } from 'node-mocks-http'
import { NextApiHandler } from 'next/dist/shared/lib/utils'

export const testApiHandler = async ({
  handler,
  requestPatcher = (req) => req,
  responsePatcher = (res) => res,
  params = {},
  test
}: {
  handler: NextApiHandler
  requestPatcher?: (req: NextApiRequest) => NextApiRequest
  responsePatcher?: (res: NextApiResponse) => NextApiResponse
  params?: Record<string, unknown>
  test: (args: {
    fetch: (init?: RequestInit) => Promise<Response>
  }) => Promise<void>
}) => {
  const { req, res } = createMocks({
    method: 'POST',
    ...params
  })

  requestPatcher(req)
  responsePatcher(res)

  await handler(req, res)

  const response = {
    status: res._getStatusCode(),
    headers: res._getHeaders(),
    body: res._getJSONData()
  }

  const fetch = async (init?: RequestInit) => {
    return new Response(JSON.stringify(response.body), {
      status: response.status,
      headers: response.headers
    })
  }

  await test({ fetch })
}


// Add an example test to prevent the "empty test file" error
describe('API Test Utils', () => {
    it('exports the testApiHandler function', () => {
      expect(typeof testApiHandler).toBe('function');
    });
  });