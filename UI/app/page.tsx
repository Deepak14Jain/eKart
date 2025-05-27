import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star, Shield, Truck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-primary text-white shadow-lg">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ShoppingBag className="h-8 w-8" />
            <span>eKart</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/login" className="text-sm font-medium hover:text-blue-200 transition-colors">
              Login
            </Link>
            <Link href="/register" className="text-sm font-medium hover:text-blue-200 transition-colors">
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  India's Biggest Online Store
                </h1>
                <p className="text-xl text-blue-100">
                  Shop from millions of products across Electronics, Fashion, Home & more. Best prices, fast delivery,
                  and easy returns.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/products">
                    <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold">
                      Start Shopping
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-primary"
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=500&fit=crop"
                    alt="Shopping Experience"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Free Delivery</h3>
                <p className="text-gray-600">Free delivery on orders above ₹499</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
                <p className="text-gray-600">100% secure payment methods</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
                <p className="text-gray-600">Genuine products with warranty</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Shop by Category</h2>
              <p className="text-xl text-gray-600">Explore our wide range of product categories</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                {
                  name: "Electronics",
                  image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
                },
                {
                  name: "Electrical",
                  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
                },
                {
                  name: "Furniture",
                  image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
                },
                {
                  name: "Cosmetics",
                  image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop",
                },
                {
                  name: "Toys & Books",
                  image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop",
                },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={`/products?category=${category.name.toLowerCase()}`}
                  className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 group-hover:scale-110 transition-transform">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
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
