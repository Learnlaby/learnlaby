'use client'

import Layout from '@/components/layout'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type SessionUser = {
  name?: string
  email?: string
}

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status !== 'authenticated' || !session?.user) return null

  const user: SessionUser = session.user
  const userEmail = user.email;
  const encodedEmail = encodeURIComponent(userEmail);


  return (
    <Layout> {/* Wrap inside Layout for Navbar & Sidebar */}
            <iframe
        src={`https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FBangkok&showPrint=0
          &color=%23039BE5
          &src=${encodedEmail}`}
        width="800"
        height="600"
        style={{ border: "0" }}
        allowFullScreen
      />
    </Layout>
    )
}
