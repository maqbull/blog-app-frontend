interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = true, ...requestConfig } = config;
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': '',
      ...config.headers,
    };

    // Add JWT token if authentication is required
    if (requiresAuth) {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        headers['Authorization']  = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...requestConfig,
        headers,
      });

      // Handle 401 Unauthorized responses
      if (response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'An error occurred');
      }

      // Return successful response
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // GET request
  public get<T>(endpoint: string, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }

  // POST request
  public post<T>(endpoint: string, data?: any, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  public put<T>(endpoint: string, data?: any, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  public delete<T>(endpoint: string, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(); 