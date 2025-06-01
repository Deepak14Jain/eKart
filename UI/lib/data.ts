import axios from "axios";

// Base URL for the API
const API_BASE_URL = "http://localhost:8080";

// Helper function to retry API calls
async function retryRequest(requestFn: () => Promise<any>, retries: number = 3, delay: number = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.warn(`Retrying request... Attempt ${attempt} of ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Centralized error handler
function handleApiError(error: any, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) {
      console.error("API Error: 403 Forbidden. Ensure the request includes a valid token and you have the necessary permissions.");
    } else {
      console.error("API Error:", error.message);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
    }
  } else {
    console.error("Unexpected Error:", error);
  }
  console.error("Fallback Message:", fallbackMessage);
  throw new Error(fallbackMessage);
}

// Fetch products from the server
export async function fetchProducts() {
  try {
    return await retryRequest(() => axios.get(`${API_BASE_URL}/products/getAll`).then((res) => res.data));
  } catch (error) {
    handleApiError(error, "Failed to fetch products. Please try again later.");
    return []; // Fallback to an empty array if the API call fails
  }
}

// Fetch products by category
export async function fetchProductsByCategory(category: string) {
  try {
    return await retryRequest(() =>
      axios.get(`${API_BASE_URL}/products/getAllByCategory/${category}`).then((res) => res.data)
    );
  } catch (error) {
    handleApiError(error, `Failed to fetch products for category ${category}. Please try again later.`);
    return []; // Fallback to an empty array if the API call fails
  }
}

// Fetch product by ID
export async function fetchProductById(productId: string) {
  try {
    return await retryRequest(() =>
      axios.get(`${API_BASE_URL}/admin/products/getById/${productId}`).then((res) => res.data)
    );
  } catch (error) {
    handleApiError(error, `Failed to fetch product details for ID ${productId}. Please try again later.`);
  }
}

// Synchronous getProductById for local/mock data (for use in [id]/page.tsx)
export function getProductById(productId: string) {
  // If you have a local products array, use it. Otherwise, return null.
  // Example:
  // import { products } from "./mock-data"
  // return products.find((p) => p.id === productId || p.productId === productId) || null;

  // Placeholder: always return null if you don't have local data
  return null;
}

// Fetch orders for the authenticated user
export async function fetchOrdersByUserId() {
  try {
    const isApiHealthy = await checkApiHealth();
    if (!isApiHealthy) {
      console.warn("API server is unavailable. Skipping fetchOrdersByUserId.");
      return []; // Return an empty array as a fallback
    }

    return await retryRequest(() =>
      axios.get(`${API_BASE_URL}/customer/getAllOrders`).then((res) => res.data)
    );
  } catch (error) {
    handleApiError(error, "Failed to fetch orders. Please try again later.");
  }
}

// Fetch feedbacks for a product
export async function fetchFeedbacksByProduct(productId: string) {
  try {
    return await retryRequest(() =>
      axios.get(`${API_BASE_URL}/getFeedbackByProduct/${productId}`).then((res) => res.data)
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn(`No feedbacks found for product ID: ${productId}`);
      return []; // Return an empty array if the product has no feedbacks
    }
    handleApiError(error, `Failed to fetch feedbacks for product ID ${productId}. Please try again later.`);
  }
}

// Check API server health
export async function checkApiHealth() {
  try {
    const response = await axios.get(`${API_BASE_URL}/healthCheck`);
    return response.data === "OK";
  } catch (error) {
    if (axios.isAxiosError(error) && error.message.includes("CORS")) {
      console.error("CORS error while checking API health. Ensure the API server allows requests from this origin.");
      return false; // Fallback to false if CORS error occurs
    }
    console.error("API health check failed. Assuming server is unavailable.");
    return false; // Fallback to false if the health check fails
  }
}

// Fetch all feedbacks
export async function fetchAllFeedbacks() {
  try {
    return await retryRequest(() => axios.get(`${API_BASE_URL}/getFeedbackByProduct`).then((res) => res.data));
  } catch (error) {
    handleApiError(error, "Failed to fetch feedbacks. Please try again later.");
  }
}

// Fetch sales data by period
export async function fetchSalesByPeriod(period: string) {
  try {
    console.log(`Fetching sales data for period: ${period}`) // Debug log
    const response = await retryRequest(() =>
      axios.get(`${API_BASE_URL}/admin/products/getSalesSummaryByProduct/${period}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Ensure token is included
        },
      }).then((res) => res.data)
    )
    console.log(`Sales data for period ${period}:`, response) // Debug log
    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error Details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    }
    handleApiError(error, `Failed to fetch sales data for period ${period}. Please try again later.`)
  }
}

// Fetch product movement analysis (fast-moving and slow-moving products)
export async function fetchProductMovementAnalysis() {
  try {
    const yearData = await fetchSalesByPeriod("YEAR");

    if (!yearData) return { fastMoving: [], slowMoving: [] };

    const productSales = yearData
      .map((data: any) => ({
        id: data.productId,
        name: data.name,
        quantity: data.totalQuantity,
        revenue: data.totalRevenue,
      }))
      .sort((a: any, b: any) => b.quantity - a.quantity);

    const totalProducts = productSales.length;
    const fastMovingCount = Math.ceil(totalProducts * 0.3);
    const slowMovingCount = Math.ceil(totalProducts * 0.3);

    return {
      fastMoving: productSales.slice(0, fastMovingCount),
      slowMoving: productSales.slice(-slowMovingCount),
    };
  } catch (error) {
    handleApiError(error, "Failed to fetch product movement analysis. Please try again later.");
  }
}
