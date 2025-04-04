import { NextRequest } from 'next/server';

export const testAppRouteHandler = async ({
  handler,
  params = {},
  searchParams = {},
  method = 'POST',
  headers = {},
  body = null,
}) => {
  // Create URL with searchParams
  const url = new URL('http://localhost:3000');
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  // Create request
  const request = new NextRequest(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // Add params to request context
  const context = { params };

  // Call handler with request and context
  const response = await handler(request, context);
  
  return response;
};