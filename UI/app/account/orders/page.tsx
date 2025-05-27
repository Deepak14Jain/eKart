"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Package,
  ArrowLeft,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { getOrdersByUserId, getProductById } from "@/lib/data"

export default function OrdersPage() {
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const userOrders = getOrdersByUserId(user.id)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ShoppingBag className="h-8 w-8" />
            <span>eKart</span>
          </Link>
          <nav className="ml-auto flex items-center gap-6">
            <Link href="/cart" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              <span className="hidden sm:block font-medium">Cart</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/account" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                <User className="h-6 w-6" />
                <span className="hidden sm:block font-medium">{user.name}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} className="text-white hover:text-blue-200">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-4 text-primary hover:text-primary/80"
              onClick={() => router.push("/account")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Account
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track and manage your order history</p>
          </div>

          {userOrders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-600 mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90">Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {userOrders
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-white border-b">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`flex items-center gap-1 px-3 py-1 border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-lg font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <div className="divide-y">
                        {order.items.map((item, index) => {
                          const product = getProductById(item.productId)
                          return (
                            <div key={`${item.productId}-${index}`} className="flex items-center gap-4 p-6">
                              <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                {product?.image ? (
                                  <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={item.productName}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 line-clamp-1">{item.productName}</h3>
                                {product && (
                                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-sm text-gray-600">
                                    Quantity: <span className="font-medium">{item.quantity}</span>
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    Price: <span className="font-medium">₹{item.price.toLocaleString()}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </p>
                                {product && (
                                  <Link
                                    href={`/products/${product.id}`}
                                    className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                                  >
                                    View Product
                                  </Link>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="bg-gray-50 px-6 py-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            {order.status === "delivered" && (
                              <Button variant="outline" size="sm">
                                Download Invoice
                              </Button>
                            )}
                            {(order.status === "pending" || order.status === "processing") && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Cancel Order
                              </Button>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Order Total</p>
                            <p className="text-xl font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm">© {new Date().getFullYear()} eKart. All rights reserved.</p>
          <nav className="flex gap-6">
            <Link href="/about" className="text-sm hover:text-blue-300 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm hover:text-blue-300 transition-colors">
              Contact
            </Link>
            <Link href="/feedback" className="text-sm hover:text-blue-300 transition-colors">
              Feedback
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
