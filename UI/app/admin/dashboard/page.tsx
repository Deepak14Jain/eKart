"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  BarChart,
  LogOut,
  ShoppingCart,
  LineChart,
  Settings,
  MessageSquare,
} from "lucide-react"
import { products, salesData, getProductMovementAnalysis } from "@/lib/data"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  const currentSalesData = salesData.find((data) => data.period === selectedPeriod)
  const { fastMoving, slowMoving } = getProductMovementAnalysis()

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
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
            >
              <BarChart className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{currentSalesData?.totalSales.toFixed(2) || "0.00"}</div>
                <p className="text-xs text-muted-foreground">For the selected {selectedPeriod}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">Total products in inventory</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Product categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Registered customers</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Tabs defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Sales Analysis</h2>
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="quarter">Quarter</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={selectedPeriod} className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Sales</CardTitle>
                      <CardDescription>Sales breakdown by category for the selected {selectedPeriod}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentSalesData && (
                        <div className="space-y-4">
                          {Object.entries(currentSalesData.categorySales).map(([category, sales]) => (
                            <div key={category} className="flex items-center">
                              <div className="w-full">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium capitalize">{category}</span>
                                  <span className="text-sm font-medium">₹{sales.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${(sales / currentSalesData.totalSales) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Selling Products</CardTitle>
                      <CardDescription>Best performing products for the selected {selectedPeriod}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentSalesData && (
                        <div className="space-y-4">
                          {Object.entries(currentSalesData.productSales)
                            .sort((a, b) => b[1].revenue - a[1].revenue)
                            .slice(0, 5)
                            .map(([id, data]) => (
                              <div key={id} className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{data.name}</div>
                                  <div className="text-sm text-muted-foreground">{data.quantity} units sold</div>
                                </div>
                                <div className="font-medium">₹{data.revenue.toFixed(2)}</div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fast Moving Products</CardTitle>
                      <CardDescription>Products with the highest sales volume</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {fastMoving.slice(0, 5).map((product) => (
                          <div key={product.id} className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.quantity} units sold</div>
                            </div>
                            <div className="font-medium">₹{product.revenue.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Slow Moving Products</CardTitle>
                      <CardDescription>Products with the lowest sales volume</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {slowMoving.slice(0, 5).map((product) => (
                          <div key={product.id} className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.quantity} units sold</div>
                            </div>
                            <div className="font-medium">₹{product.revenue.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
