jest.mock('@aws-sdk/client-s3', () => {
    return {
      S3Client: jest.fn(() => ({
        send: jest.fn().mockResolvedValue({})
      })),
      PutObjectCommand: jest.fn()
    }
  })