"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { QrCode, Mail, Copy, Send, UserPlus, X } from "lucide-react"

export default function PeoplePage() {
  const [members, setMembers] = useState<
    { id: string; name: string; email: string; role: string; image?: string | null }[]
  >([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"link" | "email">("link")
  const [email, setEmail] = useState("")
  const [emails, setEmails] = useState<string[]>([])
  const [isInviting, setIsInviting] = useState(false)
  const [notification, setNotification] = useState<{
    title: string
    message: string
    type: "success" | "error"
    visible: boolean
  } | null>(null)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const params = useParams()
  const classroomId = params?.id as string

  // Mock classroom code - in a real app, this would come from your backend
  const classroomCode = "CLASS-" + classroomId + "-" + Math.random().toString(36).substring(2, 7).toUpperCase()
  const inviteLink = `${window.location.origin}/join?code=${classroomCode}`

  useEffect(() => {
    async function fetchMembers() {
      if (!classroomId) {
        setError("Classroom ID is missing.")
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/classroom/member", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch classroom members")
        }

        const data = await response.json()
        setMembers(data.members)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [classroomId])

  const handleAddEmail = () => {
    if (email && !emails.includes(email) && email.includes("@")) {
      setEmails([...emails, email])
      setEmail("")
    } else if (!email.includes("@")) {
      setNotification({
        title: "Invalid email",
        message: "Please enter a valid email address",
        type: "error",
        visible: true,
      })
    } else if (emails.includes(email)) {
      setNotification({
        title: "Email already added",
        message: "This email is already in the list",
        type: "error",
        visible: true,
      })
    }
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove))
  }

  const handleSendInvites = async () => {
    setIsInviting(true)
    // Mock API call - in a real app, this would send the invites
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setNotification({
      title: "Invites sent!",
      message: `Sent invitations to ${emails.length} student${emails.length !== 1 ? "s" : ""}`,
      type: "success",
      visible: true,
    })
    setEmails([])
    setIsInviting(false)
    setIsInviteDialogOpen(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setNotification({
      title: "Copied to clipboard",
      message: "The invite link has been copied to your clipboard",
      type: "success",
      visible: true,
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading members...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
  }

  // Separate teachers and students
  const teachers = members.filter((member) => member.role === "teacher" || member.role === "co-teacher")
  const students = members.filter((member) => member.role === "student")

  return (
    <>
      {notification && notification.visible && (
        <Alert
          className={`fixed top-4 right-4 w-96 z-50 ${
            notification.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          <AlertTitle className="flex justify-between">
            {notification.title}
            <button onClick={() => setNotification(null)}>
              <X className="h-4 w-4" />
            </button>
          </AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex h-screen bg-background p-6">
        <div className="w-full mx-auto space-y-6">
          {/* Teacher Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Teachers</h2>
            {teachers.length > 0 ? (
              <div className="space-y-2">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg">
                    <Avatar>
                      <AvatarImage src={teacher.image || "https://placekitten.com/100/100"} alt={teacher.name} />
                      <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{teacher.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {teacher.role === "co-teacher" ? "Co-Teacher" : "Teacher"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No teachers in this classroom.</p>
            )}
          </div>

          {/* Students Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Students</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{students.length} Students</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-purple-600 border-purple-600 hover:bg-purple-50"
                  onClick={() => setIsInviteDialogOpen(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Invite Students</span>
                </Button>
              </div>
            </div>
            {students.length > 0 ? (
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg">
                    <Avatar>
                      <AvatarImage src={student.image || "https://placekitten.com/100/100"} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{student.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No students in this classroom.</p>
            )}
          </div>
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Invite Students</DialogTitle>
            <DialogDescription>Invite students to join your classroom using a code, link, or email.</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex border-b mb-6">
              <button
                onClick={() => setActiveTab("link")}
                className={`flex items-center gap-2 px-4 py-2 ${
                  activeTab === "link"
                    ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <QrCode className="h-4 w-4" />
                <span>Code & Link</span>
              </button>
              <button
                onClick={() => setActiveTab("email")}
                className={`flex items-center gap-2 px-4 py-2 ${
                  activeTab === "email"
                    ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </button>
            </div>

            {activeTab === "link" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Classroom Code</label>
                  <div className="flex">
                    <Input value={classroomCode} readOnly className="font-mono text-lg" />
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => copyToClipboard(classroomCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Invite Link</label>
                  <div className="flex">
                    <Input value={inviteLink} readOnly />
                    <Button variant="outline" size="icon" className="ml-2" onClick={() => copyToClipboard(inviteLink)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h3 className="font-medium mb-2">How students join:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Students go to the join page or scan the QR code</li>
                    <li>They enter the classroom code</li>
                    <li>You'll receive a notification to approve their request</li>
                    <li>Once approved, they'll be added to your classroom</li>
                  </ol>
                </div>
              </div>
            )}

            {activeTab === "email" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Student Email</label>
                  <div className="flex">
                    <Input
                      type="email"
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button variant="outline" className="ml-2" onClick={handleAddEmail}>
                      Add
                    </Button>
                  </div>
                </div>

                {emails.length > 0 && (
                  <div className="border rounded-md p-4">
                    <label className="text-sm font-medium mb-2 block">Recipients</label>
                    <div className="flex flex-wrap gap-2">
                      {emails.map((email, index) => (
                        <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                          <span>{email}</span>
                          <button
                            className="ml-2 text-gray-500 hover:text-gray-700"
                            onClick={() => handleRemoveEmail(email)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={emails.length === 0 || isInviting}
                  onClick={handleSendInvites}
                >
                  {isInviting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Invitations ({emails.length})
                    </span>
                  )}
                </Button>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">What happens next:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Students receive an email with a link to join your classroom</li>
                    <li>When they click the link, they'll be prompted to create an account or sign in</li>
                    <li>You'll receive a notification to approve their request</li>
                    <li>Once approved, they'll be added to your classroom</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

