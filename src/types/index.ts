
// Company model type
export interface Company {
  id?: string;
  name: string;
  sector: string;
  logo: string;
  headquarters: string;
  founded: number;
  description: string;
  revenue?: string;
  employees?: number;
  website?: string;
  ceo?: string;
}

// User model type for authentication
export interface User {
  username: string;
  password: string;
}

// Authentication response
export interface AuthResponse {
  token: string;
  user: {
    username: string;
  }
}

// API error response
export interface ApiError {
  message: string;
  status?: number;
}
