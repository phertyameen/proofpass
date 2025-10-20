const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://proofpass.onrender.com';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async getNonce(walletAddress: string): Promise<{ nonce: string }> {
    return this.request('/auth/nonce', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
  }

  async verifySignature(
    walletAddress: string,
    signature: string,
    nonce: string
  ): Promise<{ accessToken: string; user: any }> {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, signature, nonce }),
    });
  }

  async getCurrentUser(): Promise<any> {
    return this.request('/auth/me');
  }

  // Add other API methods as needed
  async createEvent(eventData: any): Promise<any> {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getEvents(): Promise<any[]> {
    return this.request('/events');
  }

  async getEvent(id: string): Promise<any> {
    return this.request(`/events/${id}`);
  }

  async attendEvent(eventId: string, proofData: any): Promise<any> {
    return this.request(`/events/${eventId}/attend`, {
      method: 'POST',
      body: JSON.stringify(proofData),
    });
  }
}

// Export a singleton instance
export const api = new ApiClient();