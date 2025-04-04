import { prismaMock } from './test-utils'
import { testApiHandler } from '../__tests__/api-test-utils'

describe('Sections API', () => {
  it('returns sections for valid classroom', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'user1' })
    prismaMock.classroomMember.findFirst.mockResolvedValue({})
    prismaMock.section.findMany.mockResolvedValue([{ id: 'sec1', name: 'Math' }])

    await testApiHandler({
      handler: require('@/app/api/classroom/[classroomId]/sections/route').POST,
      test: async ({ fetch }) => {
        const res = await fetch({ 
          method: 'POST',
          body: JSON.stringify({ classroomId: 'class1' })
        })
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual([{ id: 'sec1', name: 'Math' }])
      }
    })
  })
})