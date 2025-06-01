"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, ShoppingCart, User, Search, LogOut, Star, Zap } from "lucide-react"
import { fetchProducts, fetchProductsByCategory } from "@/lib/data"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const { user, logout } = useAuth()
  const { addItem, totalItems } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchProducts()
      setAllProducts(products)
      setFilteredProducts(
        selectedCategory === "all"
          ? products
          : products.filter(
              (p) =>
                (p.productCategory || "").toLowerCase() === selectedCategory.toLowerCase() ||
                (selectedCategory === "toys & books" &&
                  ["toys", "books"].includes((p.productCategory || "").toLowerCase()))
            )
      )
    }
    fetchData()
  }, [selectedCategory])

  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(
        selectedCategory === "all"
          ? allProducts
          : allProducts.filter(
              (p) =>
                (p.productCategory || "").toLowerCase() === selectedCategory.toLowerCase() ||
                (selectedCategory === "toys & books" &&
                  ["toys", "books"].includes((p.productCategory || "").toLowerCase()))
            )
      )
      return
    }
    const delayDebounceFn = setTimeout(() => {
      setFilteredProducts(
        allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCategory === "all"
              ? true
              : (product.productCategory || "").toLowerCase() === selectedCategory.toLowerCase() ||
                (selectedCategory === "toys & books" &&
                  ["toys", "books"].includes((product.productCategory || "").toLowerCase())))
        )
      )
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, selectedCategory, allProducts])

  const handleAddToCart = (product: Product) => {
    addItem(product)
    toast({
      title: "🛒 Added to Cart!",
      description: `${product.name} has been added to your cart.`,
      className: "animate-bounce-in",
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const fetchData = async () => {
      const products = await fetchProducts()
      if (searchQuery) {
        const filtered = products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredProducts(filtered)
      } else {
        setFilteredProducts(products)
      }
    }

    fetchData()
  }

  // Helper to render product image
  const renderProductImage = (product: Product) => {
    if (product.imagePath && typeof product.imagePath === "string") {
      // If imagePath is a full URL, use it directly
      if (product.imagePath.startsWith("http")) {
        return (
          <img
            src={product.imagePath}
            alt={product.name}
            className="object-cover w-full h-full"
            style={{ aspectRatio: "1/1" }}
          />
        )
      }
      // If imagePath is a local file path, extract the filename and use the static resource URL
      const fileName = product.imagePath.split(/[\\/]/).pop()
      if (fileName) {
        return (
          <img
            src={`http://localhost:8080/product-images/${fileName}`}
            alt={product.name}
            className="object-cover w-full h-full"
            style={{ aspectRatio: "1/1" }}
          />
        )
      }
    }
    // fallback
    return (
      <img
        src="/placeholder.svg"
        alt={product.name}
        className="object-cover w-full h-full"
        style={{ aspectRatio: "1/1" }}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ShoppingBag className="h-8 w-8" />
            <span>eKart</span>
          </Link>

          <form onSubmit={handleSearch} className="ml-6 flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for products, brands and more..."
                className="w-full pl-10 bg-white text-gray-900 border-0 focus:ring-2 focus:ring-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <nav className="ml-6 flex items-center gap-6">
            <Link href="/cart" className="flex items-center gap-2 hover:text-blue-200 transition-colors relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="hidden sm:block font-medium">Cart</span>
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-white min-w-[20px] h-5 flex items-center justify-center text-xs animate-bounce-in">
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedCategory === "all"
                ? "All Products"
                : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
            </h1>

            <Tabs
              defaultValue={selectedCategory}
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="w-full"
            >
              <TabsList className="bg-white shadow-sm border">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  All Products
                </TabsTrigger>
                <TabsTrigger
                  value="electronics"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Electronics
                </TabsTrigger>
                <TabsTrigger
                  value="electrical"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Electrical
                </TabsTrigger>
                <TabsTrigger
                  value="furniture"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Furniture
                </TabsTrigger>
                <TabsTrigger
                  value="cosmetics"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Cosmetics
                </TabsTrigger>
                <TabsTrigger
                  value="toys & books"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Toys & Books
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.productId}
                      className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                    >
                      <div className="relative">
                        <Link href={`/products/${product.productId}`}>
                          <div className="aspect-square relative overflow-hidden">
                            {renderProductImage(product)}
                          </div>
                        </Link>

                        {product.quantityOnHand < 10 && (
                          <Badge className="absolute top-2 left-2 bg-accent text-white">
                            <Zap className="h-3 w-3 mr-1" />
                            Few Left
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <Link href={`/products/${product.productId}`}>
                          <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>

                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">(4.5)</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{(product.price * 1.2).toLocaleString()}
                            </span>
                            <Badge variant="secondary" className="text-green-600 bg-green-50">
                              20% off
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {product.quantityOnHand > 0 ? (
                              <span className="text-green-600">✓ In Stock ({product.quantityOnHand} left)</span>
                            ) : (
                              <span className="text-red-600">✗ Out of Stock</span>
                            )}
                          </p>
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.quantityOnHand <= 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
                    <p className="text-gray-600">Try a different search or category.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
