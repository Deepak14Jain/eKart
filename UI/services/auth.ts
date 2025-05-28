import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export async function loginApi(email: string, password: string): Promise<boolean> {
  const response = await axios.get(`${API_BASE_URL}/customer/login`, {
    params: { username: email, password },
  });
  return response.data;
}

export async function registerApi(name: string, email: string, password: string): Promise<boolean> {
  const response = await axios.post(`${API_BASE_URL}/profile/register`, {
    name,
    username: email,
    password,
    role: "CUSTOMER",
  });
  return response.data;
}

export async function logoutApi(): Promise<void> {
  // Implement logout logic if needed (e.g., clearing tokens)
}

export async function fetchUserProfile(): Promise<any> {
  const response = await axios.get(`${API_BASE_URL}/customer/getProfile`);
  return response.data;
}
