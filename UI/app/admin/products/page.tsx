"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  ShoppingBag,
  Package,
  Users,
  LogOut,
  ShoppingCart,
  LineChart,
  Settings,
  MessageSquare,
  BarChart,
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react"
import type { Product } from "@/lib/types"

import { products } from "@/lib/data"

export default function AdminProductsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [productsList, setProductsList] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const storedProducts = localStorage.getItem("products")
      if (storedProducts) {
        return JSON.parse(storedProducts)
      }
    }
    return products
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "electronics",
    stock: 0,
    image: "/placeholder.svg?height=200&width=200",
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const existingProducts = JSON.parse(localStorage.getItem("products") || "[]")
    const allProducts = existingProducts.length > 0 ? existingProducts : products

    if (searchQuery) {
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setProductsList(filtered)
    } else {
      setProductsList(allProducts)
    }
  }

  const handleAddProduct = () => {
    const existingProducts = JSON.parse(localStorage.getItem("products") || "[]")
    const allProducts = existingProducts.length > 0 ? existingProducts : products

    const id = `p${Date.now()}` // Use timestamp for unique ID
    const productToAdd = {
      id,
      name: newProduct.name || "New Product",
      description: newProduct.description || "Product description",
      price: newProduct.price || 0,
      category: newProduct.category || "electronics",
      stock: newProduct.stock || 0,
      image: newProduct.image || "/placeholder.svg?height=200&width=200",
    }

    const updatedProducts = [...allProducts, productToAdd]

    // Save to localStorage
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Update local state
    setProductsList(updatedProducts)
    setIsAddDialogOpen(false)
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      category: "electronics",
      stock: 0,
      image: "/placeholder.svg?height=200&width=200",
    })

    toast({
      title: "Product added",
      description: `${productToAdd.name} has been added successfully.`,
    })
  }

  const handleEditProduct = () => {
    if (!selectedProduct) return

    const existingProducts = JSON.parse(localStorage.getItem("products") || "[]")
    const allProducts = existingProducts.length > 0 ? existingProducts : products

    const updatedProducts = allProducts.map((product) =>
      product.id === selectedProduct.id ? selectedProduct : product,
    )

    // Save to localStorage
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Update local state
    setProductsList(updatedProducts)
    setIsEditDialogOpen(false)

    toast({
      title: "Product updated",
      description: `${selectedProduct.name} has been updated successfully.`,
    })
  }

  const handleDeleteProduct = () => {
    if (!selectedProduct) return

    const existingProducts = JSON.parse(localStorage.getItem("products") || "[]")
    const allProducts = existingProducts.length > 0 ? existingProducts : products

    const updatedProducts = allProducts.filter((product) => product.id !== selectedProduct.id)

    // Save to localStorage
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Update local state
    setProductsList(updatedProducts)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Product deleted",
      description: `${selectedProduct.name} has been deleted successfully.`,
    })
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-6 w-6" />
            <span>eKart Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <BarChart className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
            >
              <Package className="h-4 w-4" />
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/admin/customers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="/admin/reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              Reports
            </Link>
            <Link
              href="/admin/feedback"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin/dashboard" className="md:hidden">
            <ShoppingBag className="h-6 w-6" />
            <span className="sr-only">Dashboard</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex md:items-center md:gap-2">
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="md:hidden">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Fill in the details to add a new product to your inventory.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="cosmetics">Cosmetics</SelectItem>
                        <SelectItem value="toys & books">Toys & Books</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct}>Add Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsList.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 relative rounded overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>₹{product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={isEditDialogOpen && selectedProduct?.id === product.id}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open)
                            if (!open) setSelectedProduct(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedProduct(product)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                              <DialogDescription>Make changes to the product details.</DialogDescription>
                            </DialogHeader>
                            {selectedProduct && (
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Product Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={selectedProduct.name}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={selectedProduct.description}
                                    onChange={(e) =>
                                      setSelectedProduct({ ...selectedProduct, description: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-price">Price (₹)</Label>
                                    <Input
                                      id="edit-price"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={selectedProduct.price}
                                      onChange={(e) =>
                                        setSelectedProduct({
                                          ...selectedProduct,
                                          price: Number.parseFloat(e.target.value),
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-stock">Stock</Label>
                                    <Input
                                      id="edit-stock"
                                      type="number"
                                      min="0"
                                      value={selectedProduct.stock}
                                      onChange={(e) =>
                                        setSelectedProduct({
                                          ...selectedProduct,
                                          stock: Number.parseInt(e.target.value),
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-category">Category</Label>
                                  <Select
                                    value={selectedProduct.category}
                                    onValueChange={(value) =>
                                      setSelectedProduct({ ...selectedProduct, category: value })
                                    }
                                  >
                                    <SelectTrigger id="edit-category">
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="electronics">Electronics</SelectItem>
                                      <SelectItem value="electrical">Electrical</SelectItem>
                                      <SelectItem value="furniture">Furniture</SelectItem>
                                      <SelectItem value="cosmetics">Cosmetics</SelectItem>
                                      <SelectItem value="toys & books">Toys & Books</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditProduct}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={isDeleteDialogOpen && selectedProduct?.id === product.id}
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open)
                            if (!open) setSelectedProduct(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedProduct(product)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Product</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this product? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            {selectedProduct && (
                              <div className="py-4">
                                <p className="font-medium">{selectedProduct.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteProduct}>
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {productsList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <p className="text-muted-foreground">No products found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  )
}
