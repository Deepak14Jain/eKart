"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, ShoppingCart, User, LogOut, Package, MessageSquare, Star } from "lucide-react"
import { fetchOrdersByUserId, fetchAllFeedbacks } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"

export default function AccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout } = useAuth()
  const { fetchLatestCart } = useCart() // Access fetchLatestCart from CartProvider

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [userOrders, setUserOrders] = useState([])
  const [userFeedbacks, setUserFeedbacks] = useState([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      setEditedName(user.name)
      setEditedEmail(user.email)

      const fetchOrders = async () => {
        const orders = await fetchOrdersByUserId() // Removed userId parameter
        setUserOrders(orders)
      }

      fetchOrders()
    }
  }, [user, router])

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const allFeedbacks = await fetchAllFeedbacks()
      const filteredFeedbacks = allFeedbacks.filter((feedback) => feedback.profile.profileId === user.id)
      setUserFeedbacks(filteredFeedbacks)
    }

    if (user) {
      fetchFeedbacks()
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchLatestCart() // Update cart when the page is opened
    }
  }, [user])

  if (!user) {
    return null
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update user data (in a real app, this would be an API call)
    const updatedUser = {
      ...user,
      name: editedName,
      email: editedEmail,
    }

    // Update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Update auth context (you'd need to add an updateUser function to AuthProvider)
    // For now, we'll just show a success message
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })

    setIsEditingProfile(false)
    setIsSaving(false)

    // Refresh the page to show updated data
    window.location.reload()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xl">eKart</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4 sm:gap-6">
            <Link href="/cart" className="flex items-center gap-1 text-sm font-medium">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only">Cart</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/account" className="flex items-center gap-1 text-sm font-medium">
                <User className="h-5 w-5" />
                <span className="sr-only sm:not-sr-only">{user.name}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="container">
          <h1 className="text-2xl font-bold tracking-tight mb-6">My Account</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>View and update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Account Type</h3>
                        <p className="text-base capitalize">{user.role}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                        <p className="text-base">{user.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p className="text-base">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Account Type</h3>
                        <p className="text-base capitalize">{user.role}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  {isEditingProfile ? (
                    <>
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingProfile(false)
                          setEditedName(user.name)
                          setEditedEmail(user.email)
                        }}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your past orders and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-6">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                      <Link href="/products">
                        <Button>Start Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                            <div>
                              <h3 className="font-medium">Order #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded 
                                ${
                                  order.status === "delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "shipped"
                                      ? "bg-blue-100 text-blue-800"
                                      : order.status === "processing"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : order.status === "cancelled"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.productId} className="flex justify-between">
                                <span>
                                  {item.quantity} x {item.productName}
                                </span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t mt-4 pt-4 flex justify-between font-medium">
                            <span>Total</span>
                            <span>₹{order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>My Feedback</CardTitle>
                  <CardDescription>View your submitted feedback and share new thoughts</CardDescription>
                </CardHeader>
                <CardContent>
                  {userFeedbacks.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium">Your Previous Feedback:</h4>
                      {userFeedbacks.map((feedback) => (
                        <div key={feedback.feedbackId}>
                          <p>{feedback.comment}</p>
                          <span>{new Date(feedback.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No feedbacks found.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-center py-6 border-t">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Submit New Feedback</h3>
                    <p className="text-muted-foreground mb-4">
                      Your feedback helps us improve our products and services.
                    </p>
                    <Link href="/feedback">
                      <Button>Submit Feedback</Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} eKart. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
              Contact
            </Link>
            <Link href="/feedback" className="text-sm font-medium hover:underline">
              Feedback
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
