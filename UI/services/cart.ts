import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Fetch the cart items for the authenticated user
export async function fetchCart() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.warn("No auth token found, skipping fetchCart.");
    return [];
  }
  try {
    const response = await axios.get(
      `${API_BASE_URL}/customer/getCartByProfile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as { response?: { data?: any }; message?: string }; // Type assertion for error
    const errorDetails = axiosError.response?.data || axiosError.message || "Unknown error occurred"; // Handle empty response data
    console.error("Failed to fetch cart items:", errorDetails); // Log error details
    throw axiosError; // Rethrow the error for higher-level handling
  }
}

// Add a product to the cart
export async function addToCartApi(productId: string, quantity: number) {
  console.log("Request Body:", { productId, quantity }); // Log the request body for debugging
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customer/addToCart`,
      { productId, quantity }, // Ensure both productId and quantity are included in the request body
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as { response?: { data?: any }; message?: string }; // Type assertion for error
    console.error("Failed to add product to cart:", axiosError.response?.data || axiosError.message); // Log error details
    throw axiosError; // Rethrow the error for higher-level handling
  }
}

// Update the quantity of a cart item
export async function updateCartItemApi(cartItemId: string, quantity: number) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/customer/updateCartItem`,
      { cartItemId, quantity }, // Ensure cartItemId is included in the request body
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json", // Add Content-Type header
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as { response?: { data?: any }; message?: string }; // Type assertion for error
    const errorDetails = axiosError.response?.data || axiosError.message || "Unknown error occurred"; // Handle empty response data
    console.error("Failed to update cart item:", errorDetails); // Log error details
    throw axiosError; // Rethrow the error for higher-level handling
  }
}

// Remove a cart item
export async function removeFromCartApi(cartItemId: string) {
  const response = await axios.delete(
    `${API_BASE_URL}/customer/removeFromCart/${cartItemId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );
  return response.data;
}

// Clear the entire cart
export async function clearCartApi() {
  const response = await axios.delete(`${API_BASE_URL}/customer/clearCart`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  return response.data;
}
