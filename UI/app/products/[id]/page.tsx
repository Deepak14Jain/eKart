"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  ArrowLeft,
  Minus,
  Plus,
  Star,
  Heart,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react"
import { getProductById } from "@/lib/data"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const product = getProductById(productId)
  const [quantity, setQuantity] = useState(1)
  const { user, logout } = useAuth()
  const { addItem, totalItems } = useCart()
  const { toast } = useToast()

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => router.push("/products")} className="bg-primary">
          Back to Products
        </Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    toast({
      title: "🛒 Added to Cart!",
      description: `${quantity} ${quantity === 1 ? "item" : "items"} of ${product.name} added to your cart.`,
      className: "animate-bounce-in",
    })
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
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
            <Link href="/cart" className="flex items-center gap-2 hover:text-blue-200 transition-colors relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="hidden sm:block font-medium">Cart</span>
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </Badge>
              )}
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
          <Button variant="ghost" className="mb-6 text-primary hover:text-primary/80" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square relative rounded-xl overflow-hidden bg-white shadow-lg">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(4.5) • 1,234 reviews</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-lg text-gray-500 line-through">₹{(product.price * 1.2).toLocaleString()}</span>
                  <Badge className="bg-green-100 text-green-800">20% off</Badge>
                </div>
                <p className="text-sm text-green-600 font-medium">inclusive of all taxes</p>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant={product.stock > 0 ? "default" : "destructive"} className="text-sm">
                  {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : "✗ Out of Stock"}
                </Badge>
                <Badge variant="secondary" className="text-sm capitalize">
                  {product.category}
                </Badge>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-2">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <Separator />

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={increaseQuantity} disabled={quantity >= product.stock}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold py-3"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3"
                    size="lg"
                    disabled={product.stock <= 0}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Truck className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Free Delivery</p>
                    <p className="text-xs text-gray-600">On orders above ₹499</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <RotateCcw className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">7 Days Return</p>
                    <p className="text-xs text-gray-600">Easy returns</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">Warranty</p>
                    <p className="text-xs text-gray-600">1 year warranty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
