"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, ShoppingCart, User, LogOut, Package, MessageSquare, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"
import axios from "axios"

// Add a type for product feedback items
type ProductFeedbackItem = {
  productId: string
  productName: string
  // Optionally, add other fields if needed
}

export default function AccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout } = useAuth()
  const { fetchLatestCart } = useCart() // Access fetchLatestCart from CartProvider

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [userOrders, setUserOrders] = useState([])
  const [productsWithoutFeedback, setProductsWithoutFeedback] = useState<ProductFeedbackItem[]>([])
  const [productsWithFeedback, setProductsWithFeedback] = useState<ProductFeedbackItem[]>([])
  const [feedbacks, setFeedbacks] = useState<{ [productId: string]: string }>({})
  const [feedbackInputs, setFeedbackInputs] = useState<{ [productId: string]: string }>({})
  const [submitting, setSubmitting] = useState<{ [productId: string]: boolean }>({})
  const [feedbackRatings, setFeedbackRatings] = useState<{ [productId: string]: number }>({})
  const [ratingInputs, setRatingInputs] = useState<{ [productId: string]: number }>({})
  const [productDetailsMap, setProductDetailsMap] = useState<{ [productId: string]: any }>({})

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      setEditedName(user.name)
      setEditedEmail(user.email)

      const fetchOrders = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8080/customer/getAllOrders",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          )
          setUserOrders(response.data)
        } catch (error) {
          console.error("Failed to fetch orders:", error)
          toast({
            title: "Error fetching orders",
            description: "Please try again later.",
            variant: "destructive",
          })
        }
      }
      fetchOrders()
    }
  }, [user, router, toast])

  useEffect(() => {
    if (user) {
      fetchLatestCart() // Update cart when the page is opened
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      console.log("User not logged in, redirecting to login page.");
      router.push("/login");
      return;
    }

    const fetchProductsWithoutFeedback = async () => {
      try {
        console.log("Fetching products without feedback...");
        const response = await fetch("http://localhost:8080/customer/productsWithoutFeedback", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const productIds = await response.json();
        console.log("Product IDs without feedback fetched:", productIds);

        const products = productIds
          .map((productId: string) => productDetailsMap[productId])
          .filter((product) => product !== undefined);
        console.log("Mapped products without feedback:", products);
        setProductsWithoutFeedback(products || []);
      } catch (error) {
        console.error("Error fetching products without feedback:", error);
        setProductsWithoutFeedback([]);
      }
    };

    if (Object.keys(productDetailsMap).length > 0) {
      fetchProductsWithoutFeedback();
    } else {
      console.log("Waiting for productDetailsMap to be populated...");
    }

    console.log("Fetching all orders...");
    axios
      .get("http://localhost:8080/customer/getAllOrders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => {
        console.log("Orders fetched successfully:", res.data);
        const allProducts = res.data.flatMap((order: any) =>
          order.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
          }))
        );
        const uniqueProducts = Array.from(
          new Map(allProducts.map((p: ProductFeedbackItem) => [p.productId, p])).values()
        );
        console.log("Unique products extracted:", uniqueProducts);

        Promise.all(
          uniqueProducts.map(async (product) => {
            const resp = await fetch(
              `http://localhost:8080/customer/hasFeedback?productId=${product.productId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              }
            );
            const hasFeedback = await resp.json();
            console.log(`Feedback status for product ${product.productId}:`, hasFeedback);
            return hasFeedback ? product : null;
          })
        ).then((results) => {
          const filteredResults = results.filter(Boolean) as ProductFeedbackItem[];
          console.log("Products with feedback:", filteredResults);
          setProductsWithFeedback(filteredResults);
        });
      })
      .catch((error) => {
        console.error("Failed to fetch orders or products:", error);
        setProductsWithFeedback([]);
      });
  }, [user, productDetailsMap])

  useEffect(() => {
    if (user) {
      console.log("Fetching all orders to build product details map...");
      axios
        .get("http://localhost:8080/customer/getAllOrders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then((res) => {
          console.log("Orders fetched for product details map:", res.data);
          const details: { [productId: string]: any } = {};
          res.data.forEach((order: any) => {
            order.items.forEach((item: any) => {
              details[item.productId] = {
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                price: item.price,
                description: item.description || "No description available",
              };
            });
          });
          console.log("Product details map built:", details);
          setProductDetailsMap(details);
        })
        .catch((error) => {
          console.error("Failed to fetch product details:", error);
          setProductDetailsMap({});
        });
    }
  }, [user])

  // Fetch feedbacks for products with feedback (now also fetch rating)
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const result: { [productId: string]: string } = {}
      const ratings: { [productId: string]: number } = {}
      await Promise.all(productsWithFeedback.map(async (product) => {
        // Simulate fetching feedback comment and rating from localStorage
        const stored = localStorage.getItem(`feedback_${product.productId}`)
        const storedRating = localStorage.getItem(`feedback_rating_${product.productId}`)
        if (stored) result[product.productId] = stored
        else result[product.productId] = "Feedback submitted."
        if (storedRating) ratings[product.productId] = parseInt(storedRating)
      }))
      setFeedbacks(result)
      setFeedbackRatings(ratings)
    }
    if (productsWithFeedback.length > 0) fetchFeedbacks()
  }, [productsWithFeedback])

  // Initialize ratingInputs to 5 for all products needing feedback
  useEffect(() => {
    if (productsWithoutFeedback.length > 0) {
      setRatingInputs((prev) => {
        const updated = { ...prev }
        productsWithoutFeedback.forEach((product) => {
          if (updated[product.productId] === undefined) {
            updated[product.productId] = 5
          }
        })
        return updated
      })
    }
  }, [productsWithoutFeedback])

  const handleFeedbackInput = (productId: string, value: string) => {
    setFeedbackInputs((prev) => ({ ...prev, [productId]: value }))
  }

  const handleRatingInput = (productId: string, value: number) => {
    setRatingInputs((prev) => ({ ...prev, [productId]: value }))
  }

  const handleSubmitFeedback = async (productId: string) => {
    setSubmitting((prev) => ({ ...prev, [productId]: false }));

    // Only keep essential validation and API call
    const comment = feedbackInputs[productId];
    const rating = ratingInputs[productId] ?? 5;

    if (!comment || !comment.trim()) {
      toast({ title: "Feedback required", description: "Please enter your feedback.", variant: "destructive" });
      return;
    }

    setSubmitting((prev) => ({ ...prev, [productId]: true }));

    try {
      let response;
      try {
        response = await axios.post(
          `http://localhost:8080/customer/submitFeedback?productId=${encodeURIComponent(productId)}&comment=${encodeURIComponent(comment)}&rating=${encodeURIComponent(rating)}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            timeout: 8000,
          }
        );
      } catch (err: any) {
        toast({
          title: "Network Error",
          description: err?.message || "Could not reach the server. Please try again.",
          variant: "destructive",
        });
        setSubmitting((prev) => ({ ...prev, [productId]: false }));
        return;
      }

      if (response.status !== 200) {
        toast({ title: "Error", description: response.data || "Failed to submit feedback.", variant: "destructive" });
        throw new Error(`Failed to submit feedback: ${response.statusText}`);
      }

      toast({ title: "Feedback submitted", description: "Thank you for your feedback!" });

      setProductsWithoutFeedback((prev) => prev.filter((p) => p.productId !== productId));
      localStorage.setItem(`feedback_${productId}`, comment);
      localStorage.setItem(`feedback_rating_${productId}`, rating.toString());

      setProductsWithFeedback((prev) => [
        ...prev,
        {
          productId,
          productName: productDetailsMap[productId]?.productName || "",
        },
      ]);

      setFeedbackInputs((prev) => ({ ...prev, [productId]: "" }));
      setRatingInputs((prev) => ({ ...prev, [productId]: 5 }));
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Failed to submit feedback. Please try again.", variant: "destructive" });
    }

    setSubmitting((prev) => ({ ...prev, [productId]: false }));
  }

  // Debugging: Ensure the button's onClick handler is correctly bound
  const renderFeedbackButton = (productId: string) => {
    console.log(`Rendering Submit Feedback button for product: ${productId}`); // Debugging log
    return (
      <Button
        type="button"
        onClick={() => {
          console.log(`Submit Feedback button clicked for product: ${productId}`); // Debugging log
          handleSubmitFeedback(productId);
        }}
        disabled={submitting[productId]}
      >
        {submitting[productId] ? "Submitting..." : "Submit Feedback"}
      </Button>
    );
  };

  if (!user) {
    return null
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update user data (in a real app, this would be an API call)
    const updatedUser = {
      ...user,
      name: editedName,
      email: editedEmail,
    }

    // Update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Update auth context (you'd need to add an updateUser function to AuthProvider)
    // For now, we'll just show a success message
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })

    setIsEditingProfile(false)
    setIsSaving(false)

    // Refresh the page to show updated data
    window.location.reload()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xl">eKart</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4 sm:gap-6">
            <Link href="/cart" className="flex items-center gap-1 text-sm font-medium">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only">Cart</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/account" className="flex items-center gap-1 text-sm font-medium">
                <User className="h-5 w-5" />
                <span className="sr-only sm:not-sr-only">{user.name}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="container">
          <h1 className="text-2xl font-bold tracking-tight mb-6">My Account</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>View and update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Account Type</h3>
                        <p className="text-base capitalize">{user.role}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                        <p className="text-base">{user.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p className="text-base">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Account Type</h3>
                        <p className="text-base capitalize">{user.role}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  {isEditingProfile ? (
                    <>
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingProfile(false)
                          setEditedName(user.name)
                          setEditedEmail(user.email)
                        }}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your past orders and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-6">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                      <Link href="/products">
                        <Button>Start Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.orderId} className="border rounded-lg p-4">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                            <div>
                              <h3 className="font-medium">Order #{order.orderId}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.orderDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded 
                                  ${
                                    order.status.toLowerCase() === "delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status.toLowerCase() === "shipped"
                                      ? "bg-blue-100 text-blue-800"
                                      : order.status.toLowerCase() === "processing"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : order.status.toLowerCase() === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : order.status.toLowerCase() === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }
                                `}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.productId} className="flex justify-between">
                                <span>
                                  {item.quantity} x {item.productName}
                                </span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t mt-4 pt-4 flex justify-between font-medium">
                            <span>Total</span>
                            <span>₹{order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>My Feedback</CardTitle>
                  <CardDescription>
                    View your submitted feedback and share new thoughts for products you've ordered.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Products needing feedback */}
                  {productsWithoutFeedback.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-medium mb-2">Products awaiting your feedback:</h4>
                      <div className="space-y-4">
                        {productsWithoutFeedback.map((product) => {
                          const details = productDetailsMap[product.productId];
                          return (
                            <div key={product.productId} className="border rounded-lg p-4 flex flex-col gap-2">
                              <div>
                                <span className="font-semibold">Product: </span>
                                <span className="font-semibold text-primary">
                                  {details?.productName || "Unknown Product"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={`${product.productId}-star-input-${star}`}
                                    className={`h-6 w-6 cursor-pointer ${
                                      (ratingInputs[product.productId] ?? 5) >= star
                                        ? "fill-primary text-primary"
                                        : "text-muted-foreground"
                                    }`}
                                    onClick={() => handleRatingInput(product.productId, star)}
                                  />
                                ))}
                              </div>
                              <textarea
                                className="border rounded p-2"
                                rows={2}
                                placeholder="Write your feedback..."
                                value={feedbackInputs[product.productId] || ""}
                                onChange={(e) => handleFeedbackInput(product.productId, e.target.value)}
                                disabled={submitting[product.productId]}
                              />
                              {renderFeedbackButton(product.productId)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* Products with feedback */}
                  {productsWithFeedback.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-medium">Your Previous Feedback:</h4>
                      {productsWithFeedback.map((product) => {
                        const details = productDetailsMap[product.productId];
                        const rating = feedbackRatings[product.productId] || 5;
                        return (
                          <div key={product.productId} className="border rounded-lg p-4 flex flex-col gap-1">
                            <span className="font-semibold">{details?.productName || "Unknown Product"}</span>
                            <div className="flex items-center gap-1 mb-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={`${product.productId}-star-display-${star}`}
                                  className={`h-5 w-5 ${
                                    rating >= star ? "fill-primary text-primary" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-muted-foreground">{feedbacks[product.productId]}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>No feedbacks found.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-center py-6 border-t">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Thank you for helping us improve!</h3>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} eKart. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
              Contact
            </Link>
            <Link href="/feedback" className="text-sm font-medium hover:underline">
              Feedback
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
