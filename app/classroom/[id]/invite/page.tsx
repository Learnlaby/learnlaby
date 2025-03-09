import { redirect } from "next/navigation"

export default function InvitePage({ params }) {
  const { id } = params
  // Redirect to the member page which now includes the invite functionality
  redirect(`/classroom/${id}/member`)
}

