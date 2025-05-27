"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ShoppingBag, ShoppingCart, User, LogOut, Star } from "lucide-react"

export default function FeedbackPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState("5")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to submit feedback.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter your feedback message.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newFeedback = {
        id: `f${Date.now()}`,
        userId: user.id,
        userName: user.name,
        message,
        rating: Number.parseInt(rating),
        createdAt: new Date().toISOString(),
      }

      // Get existing feedbacks from localStorage
      const existingFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]")

      // Add new feedback
      const updatedFeedbacks = [...existingFeedbacks, newFeedback]

      // Save to localStorage
      localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks))

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback! We appreciate your input.",
      })

      setMessage("")
      setRating("5")
      setIsSubmitting(false)

      // Redirect to account page after successful submission
      setTimeout(() => {
        router.push("/account")
      }, 1500)
    }, 1000)
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
            {user ? (
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
            ) : (
              <Link href="/login" className="text-sm font-medium">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight mb-6">Submit Feedback</h1>

          <Card>
            <CardHeader>
              <CardTitle>We Value Your Feedback</CardTitle>
              <CardDescription>Your feedback helps us improve our products and services.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <RadioGroup id="rating" value={rating} onValueChange={setRating} className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Label
                        key={value}
                        htmlFor={`rating-${value}`}
                        className="flex flex-col items-center space-y-2 cursor-pointer"
                      >
                        <RadioGroupItem id={`rating-${value}`} value={value.toString()} className="sr-only" />
                        <Star
                          className={`h-8 w-8 ${Number.parseInt(rating) >= value ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                        <span className="text-sm">{value}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Your Feedback</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what you think about our products and services..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">Thank you for taking the time to provide feedback.</p>
            </CardFooter>
          </Card>
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
