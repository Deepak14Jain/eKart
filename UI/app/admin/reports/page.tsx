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
  LogOut,
  ShoppingCart,
  LineChart,
  Settings,
  MessageSquare,
  BarChart,
  Download,
  Star,
} from "lucide-react"
import { salesData, feedbacks } from "@/lib/data"

export default function AdminReportsPage() {
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
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
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
            <h1 className="text-2xl font-bold">Reports</h1>
          </div>

          <Tabs defaultValue="sales" className="space-y-6">
            <TabsList>
              <TabsTrigger value="sales">Sales Reports</TabsTrigger>
              <TabsTrigger value="feedback">Feedback Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Sales Reports</h2>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border">
                    <Button
                      variant={selectedPeriod === "week" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedPeriod("week")}
                    >
                      Week
                    </Button>
                    <Button
                      variant={selectedPeriod === "month" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedPeriod("month")}
                    >
                      Month
                    </Button>
                    <Button
                      variant={selectedPeriod === "quarter" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedPeriod("quarter")}
                    >
                      Quarter
                    </Button>
                    <Button
                      variant={selectedPeriod === "year" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedPeriod("year")}
                    >
                      Year
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>
                    Sales Summary - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
                  </CardTitle>
                  <CardDescription>Overview of sales performance for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                      <p className="text-2xl font-bold">₹{currentSalesData?.totalSales.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Top Category</h3>
                      <p className="text-2xl font-bold capitalize">
                        {currentSalesData
                          ? Object.entries(currentSalesData.categorySales).sort((a, b) => b[1] - a[1])[0][0]
                          : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Top Product</h3>
                      <p className="text-2xl font-bold">
                        {currentSalesData
                          ? Object.entries(currentSalesData.productSales).sort(
                              (a, b) => b[1].revenue - a[1].revenue,
                            )[0][1].name
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Sales</CardTitle>
                    <CardDescription>Sales breakdown by category for the selected {selectedPeriod}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentSalesData && (
                      <div className="space-y-4">
                        {Object.entries(currentSalesData.categorySales)
                          .sort((a, b) => b[1] - a[1])
                          .map(([category, sales]) => (
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
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Customer Feedback</h2>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Feedback Summary</CardTitle>
                  <CardDescription>Overview of customer feedback and ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Total Feedback</h3>
                      <p className="text-2xl font-bold">{feedbacks.length}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Average Rating</h3>
                      <p className="text-2xl font-bold">
                        {feedbacks.length > 0
                          ? (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length).toFixed(
                              1,
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Latest Feedback</h3>
                      <p className="text-2xl font-bold">
                        {feedbacks.length > 0
                          ? new Date(
                              feedbacks.sort(
                                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                              )[0].createdAt,
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Feedback</CardTitle>
                  <CardDescription>Latest customer feedback and ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  {feedbacks.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">No feedback available</p>
                  ) : (
                    <div className="space-y-6">
                      {feedbacks
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((feedback) => (
                          <div key={feedback.id} className="border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{feedback.userName}</div>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < feedback.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{feedback.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
