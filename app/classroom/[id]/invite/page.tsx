"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QrCode, Mail, Copy, Send, Users, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function InviteStudentsPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<"link" | "email">("link")
  const [email, setEmail] = useState("")
  const [emails, setEmails] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{
    title: string
    message: string
    type: "success" | "error"
    visible: boolean
  } | null>(null)

  // Mock classroom code - in a real app, this would come from your backend
  const classroomCode = "CLASS-" + id + "-" + Math.random().toString(36).substring(2, 7).toUpperCase()
  const inviteLink = `${window.location.origin}/join?code=${classroomCode}`

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
    setIsLoading(true)
    // Mock API call - in a real app, this would send the invites
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setNotification({
      title: "Invites sent!",
      message: `Sent invitations to ${emails.length} student${emails.length !== 1 ? "s" : ""}`,
      type: "success",
      visible: true,
    })
    setEmails([])
    setIsLoading(false)
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
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="flex items-center mb-6">
          <Users className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Invite Students</h1>
        </div>

        <div className="w-full">
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
              <span>Invite via QR Code/Link</span>
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
              <span>Invite via Email</span>
            </button>
          </div>

          {activeTab === "link" && (
            <div className="border rounded-lg">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Share Classroom Code or Link</h2>
                <p className="text-sm text-muted-foreground">
                  Students can join your classroom using this code or by scanning the QR code.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    {/* This would be a real QR code in production */}
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-gray-500" />
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div>
                      <label htmlFor="classroom-code" className="block text-sm font-medium mb-1">
                        Classroom Code
                      </label>
                      <div className="flex">
                        <Input id="classroom-code" value={classroomCode} readOnly className="font-mono text-lg" />
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
                      <label htmlFor="invite-link" className="block text-sm font-medium mb-1">
                        Invite Link
                      </label>
                      <div className="flex">
                        <Input id="invite-link" value={inviteLink} readOnly />
                        <Button
                          variant="outline"
                          size="icon"
                          className="ml-2"
                          onClick={() => copyToClipboard(inviteLink)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">How students join:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Students go to the join page or scan the QR code</li>
                    <li>They enter the classroom code</li>
                    <li>You'll receive a notification to approve their request</li>
                    <li>Once approved, they'll be added to your classroom</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="border rounded-lg">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Send Email Invitations</h2>
                <p className="text-sm text-muted-foreground">
                  Invite students directly by sending them an email with the join link.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Student Email
                    </label>
                    <div className="flex">
                      <Input
                        id="email"
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
                      <label className="block text-sm font-medium mb-2">Recipients</label>
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
                    disabled={emails.length === 0 || isLoading}
                    onClick={handleSendInvites}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Invitations ({emails.length})
                      </span>
                    )}
                  </Button>
                </div>

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
            </div>
          )}
        </div>
      </div>
    </>
  )
}

