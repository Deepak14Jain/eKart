"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, ShoppingCart, User, LogOut, Trash, Plus, Minus, CheckCircle, Truck } from "lucide-react"
import { orders } from "@/lib/data"

export default function CartPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const orderId = `o${orders.length + 1}`

      toast({
        title: "🎉 Order Placed Successfully!",
        description: `Your order #${orderId} has been placed. You'll receive a confirmation email shortly.`,
        className: "animate-bounce-in",
      })

      clearCart()
      setIsProcessing(false)
      router.push("/account/orders")
    }, 2000)
  }

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId)
    toast({
      title: "Item Removed",
      description: `${productName} has been removed from your cart.`,
    })
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
            <Link href="/cart" className="flex items-center gap-2 text-blue-200 relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="font-medium">Cart ({totalItems})</span>
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/account" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                  <User className="h-6 w-6" />
                  <span className="hidden sm:block font-medium">{user.name}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} className="text-white hover:text-blue-200">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/login" className="font-medium hover:text-blue-200 transition-colors">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="container px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

          {items.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90">Continue Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Cart Items ({totalItems})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {items.map((item, index) => (
                      <div
                        key={item.product.id}
                        className={`flex items-center gap-4 p-6 ${index !== items.length - 1 ? "border-b" : ""}`}
                      >
                        <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.product.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xl font-bold text-gray-900">
                              ₹{item.product.price.toLocaleString()}
                            </span>
                            <Badge variant="secondary" className="text-green-600 bg-green-50">
                              <Truck className="h-3 w-3 mr-1" />
                              Free Delivery
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push("/products")}>
                      Continue Shopping
                    </Button>
                    <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-700">
                      Clear Cart
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Price Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Price ({totalItems} items)</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charges</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{Math.round(totalPrice * 0.1).toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span>₹{Math.round(totalPrice * 0.9).toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      You will save ₹{Math.round(totalPrice * 0.1).toLocaleString()} on this order
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Place Order
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
