import { AuthResponse, CalculationNode, CreateCalculationDto, CreateOperationDto, User } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: T & { error?: string };
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }

      // Retry on network errors only
      const isNetworkError = error instanceof TypeError && error.message === 'Failed to fetch';
      if (isNetworkError && retryCount < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      throw error;
    }
  }

  async register(username: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async getCalculations(): Promise<CalculationNode[]> {
    return this.request<CalculationNode[]>('/calculations');
  }

  async getCalculation(id: number): Promise<CalculationNode> {
    return this.request<CalculationNode>(`/calculations/${id}`);
  }

  async createCalculation(data: CreateCalculationDto): Promise<CalculationNode> {
    return this.request<CalculationNode>('/calculations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async respondToCalculation(
    parentId: number,
    data: CreateOperationDto
  ): Promise<CalculationNode> {
    return this.request<CalculationNode>(`/calculations/${parentId}/respond`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
