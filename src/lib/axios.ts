import axios from "axios";

const resolveBaseUrl = (): string => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return (
      process.env.API_BASE_URL ?? "http://product.amigoscodeplayground.com:8080"
    );
  }

  if (process.env.NODE_ENV === "production") {
    return "/api/proxy";
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
};
const api = axios.create({
  baseURL: resolveBaseUrl(),
  // You can add more default config here
});

export default api;
