
/**
 * PRODUCTION API UTILITY (Cross-Origin Secure Cookie Edition)
 * Centralized fetch wrapper that handles absolute URLs, credentials, and robust error reporting.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Use credentials: 'include' to ensure HTTP-only cookies are sent across origins
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (isDev) {
    console.log(`[API REQUEST] ${options.method || 'GET'} ${endpoint}`);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

    if (response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        localStorage.removeItem("sn_user");
        window.location.href = '/login?reason=expired';
      }
      throw new ApiError("Session expired. Please log in again.", 401, null);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(data.error || "An unexpected infrastructure error occurred", response.status, data);
    }

    return data;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Could not connect to the sendnrest infrastructure. Check your connection.", 0, null);
  }
}
