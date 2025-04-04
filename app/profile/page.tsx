'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SIGNIN_PAGE } from '@/lib/api_routes'

type SessionUser = {
  name?: string
  email?: string
}

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(SIGNIN_PAGE)
    }
  }, [status, router])

  if (status !== 'authenticated' || !session?.user) return null

  const user: SessionUser = session.user

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md">
        <p>
          Welcome, <b>{user.name}!</b>
        </p>
        <p>Email: {user.email}</p>
        <button
          onClick={() => signOut({ callbackUrl: SIGNIN_PAGE })}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
