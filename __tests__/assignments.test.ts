import { FormData, File } from 'formdata-node'
import { FormDataEncoder } from 'form-data-encoder'
import { Readable } from 'stream'
import { fetch } from 'undici'

import { prismaMock } from './test-utils'
import { testApiHandler } from './api-test-utils'
import { PutObjectCommand } from '@aws-sdk/client-s3'

jest.mock('@aws-sdk/client-s3')

describe('Assignment Creation', () => {
  it('creates assignment with files', async () => {
    // Mock Prisma responses
    prismaMock.user.findUnique.mockResolvedValue({
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        password: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        image: null,
      })
    prismaMock.classroomMember.findFirst.mockResolvedValue({
        id: 'member1',
        userId: 'user1',
        classroomId: 'class1',
        role: 'student',
        joinedAt: new Date(),
      })
    prismaMock.post.create.mockResolvedValue({ 
        id: 'post1',
        createdAt: new Date(),
        userId: 'user1',
        type: 'assignment',
        classroomId: 'class1',
        sectionId: null,
        title: 'Math HW',
        content: null,
        dueDate: null,
        maxScore: null
      })
      

    const formData = new FormData()
    formData.set('classroomId', 'class1')
    formData.set('title', 'Math HW')
    formData.set('files', new File(['content'], 'test.txt'))

    const encoder = new FormDataEncoder(formData)
    const body = Readable.from(encoder.encode()) // readable stream

    await testApiHandler({
      handler: require('@/app/api/classroom/posts/assignment/submission/route').POST,
      test: async ({ fetch }) => {
        const res = await fetch({ 
          method: 'POST',
          body: body as any,
          headers: encoder.headers,
        })

        expect(res.status).toBe(201)
        expect(PutObjectCommand).toHaveBeenCalled()

        const data = await res.json()
        expect(data.assignment).toBeDefined()
        expect(data.files).toBeDefined()
      }
    })
  })
})