"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

type User = {
  id: string
  name: string
  email: string
  role: string // allow any string, not just "admin" | "customer"
  username?: string
  address?: string
  phoneNumber?: string
  profileId?: string
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
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("User loaded from localStorage:", parsedUser); // Debug log
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    } else {
      console.log("No user or token found in localStorage.");
    }

    setIsLoading(false);
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Add debug log before axios call
      console.log("Attempting login axios POST to backend...", { email, password })

      const response = await axios.post("http://localhost:8080/customer/login", {
        username: email,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 8000,
      })

      // Add debug log after axios call
      console.log("Login axios POST completed", response)

      if (response.status === 200 && response.data) {
        const data = response.data
        const token = data.token
        const user = {
          id: data.email,
          username: data.username,
          email: data.email,
          role: data.role, // do not lowercase here, keep as returned by API
          address: data.address || "",
          phoneNumber: data.phoneNumber || "",
          name: data.name || "",
          profileId: data.profileId || "",
        }
        localStorage.setItem("authToken", token)
        localStorage.setItem("user", JSON.stringify(user))
        setUser(user)
        setIsLoading(false)
        return true
      }
      console.error("Login failed")
    } catch (error: any) {
      // Add debug log for error
      console.error("Login API call failed:", error)
      alert("Login API call failed: " + (error?.message || error))
    } finally {
      setIsLoading(false)
    }
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
    localStorage.removeItem("authToken") // Remove the token on logout
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
