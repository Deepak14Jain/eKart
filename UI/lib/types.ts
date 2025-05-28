export type Product = {
  productId: string // Add productId property
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  image: string
  quantityOnHand: number; // Add quantityOnHand property
}

export type Order = {
  id: string
  userId: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
  }[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
}

export type Feedback = {
  id: string
  userId: string
  userName: string
  message: string
  rating: number
  createdAt: string
}

export type SalesData = {
  period: string
  totalSales: number
  categorySales: {
    [category: string]: number
  }
  productSales: {
    [productId: string]: {
      name: string
      quantity: number
      revenue: number
    }
  }
}
