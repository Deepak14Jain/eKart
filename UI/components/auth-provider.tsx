"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "customer"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updatedUser: User) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check for hardcoded demo users first
    if (email === "admin@example.com" && password === "admin123") {
      const adminUser = {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin" as const,
      }
      setUser(adminUser)
      localStorage.setItem("user", JSON.stringify(adminUser))
      setIsLoading(false)
      return true
    } else if (email === "user@example.com" && password === "user123") {
      const customerUser = {
        id: "2",
        name: "Customer User",
        email: "user@example.com",
        role: "customer" as const,
      }
      setUser(customerUser)
      localStorage.setItem("user", JSON.stringify(customerUser))
      setIsLoading(false)
      return true
    }

    // Check for registered users in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const registeredPasswords = JSON.parse(localStorage.getItem("userPasswords") || "{}")

    const foundUser = registeredUsers.find((user: User) => user.email === email)

    if (foundUser && registeredPasswords[email] === password) {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const existingUser = registeredUsers.find((user: User) => user.email === email)

    if (existingUser) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: "customer" as const,
    }

    // Store user in registered users list
    const updatedUsers = [...registeredUsers, newUser]
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

    // Store password separately (in real app, this would be hashed)
    const userPasswords = JSON.parse(localStorage.getItem("userPasswords") || "{}")
    userPasswords[email] = password
    localStorage.setItem("userPasswords", JSON.stringify(userPasswords))

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Also update in registered users list
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const updatedUsers = registeredUsers.map((user: User) => (user.id === updatedUser.id ? updatedUser : user))
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
