import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'jest-mock-extended'
// import { describe, it, expect } from '@jest/globals';


const prismaMock = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(prismaMock)
})

export { prismaMock }


describe('Test Utils', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true);
  });
});
