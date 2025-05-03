
import { AuthResponse, Company, ApiError, User } from "../types";

// Base URL for API (mock for now)
const API_URL = "/api";

// Simulate fetch with a delay to mimic real API calls
const simulateFetch = async <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Mock data for companies
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Grameenphone",
    sector: "Telecommunications",
    logo: "https://logos-world.net/wp-content/uploads/2022/07/Grameenphone-Logo.png",
    headquarters: "Dhaka, Bangladesh",
    founded: 1997,
    description: "Grameenphone is the largest mobile telecommunications operator in Bangladesh by subscriber count.",
    revenue: "$1.5 billion",
    employees: 5000,
    website: "https://www.grameenphone.com",
    ceo: "Yasir Azman"
  },
  {
    id: "2",
    name: "BRAC Bank",
    sector: "Banking",
    logo: "https://www.bracbank.com/images/logo.svg",
    headquarters: "Dhaka, Bangladesh",
    founded: 2001,
    description: "BRAC Bank is a private commercial bank focused on Small and Medium Enterprises (SME).",
    revenue: "$450 million",
    employees: 8000,
    website: "https://www.bracbank.com",
    ceo: "Selim R. F. Hussain"
  },
  {
    id: "3",
    name: "Beximco Pharmaceuticals",
    sector: "Pharmaceuticals",
    logo: "https://www.beximcopharma.com/images/logo-pharma.svg",
    headquarters: "Dhaka, Bangladesh",
    founded: 1980,
    description: "Beximco Pharma is one of the largest pharmaceutical companies in Bangladesh.",
    revenue: "$300 million",
    employees: 4500,
    website: "https://www.beximcopharma.com",
    ceo: "Nazmul Hassan"
  },
  {
    id: "4",
    name: "Square Pharmaceuticals",
    sector: "Pharmaceuticals",
    logo: "https://www.squarepharma.com.bd/images/logo.png",
    headquarters: "Dhaka, Bangladesh",
    founded: 1958,
    description: "Square Pharmaceuticals is the largest pharmaceutical company in Bangladesh.",
    revenue: "$550 million",
    employees: 9500,
    website: "https://www.squarepharma.com.bd",
    ceo: "Tapan Chowdhury"
  },
  {
    id: "5",
    name: "Bashundhara Group",
    sector: "Conglomerate",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Bashundhara_Group.jpg",
    headquarters: "Dhaka, Bangladesh",
    founded: 1987,
    description: "Bashundhara Group is one of the largest industrial conglomerates in Bangladesh.",
    revenue: "$2 billion",
    employees: 20000,
    website: "https://www.bashundharagroup.com",
    ceo: "Ahmed Akbar Sobhan"
  },
  {
    id: "6",
    name: "ACI Limited",
    sector: "Conglomerate",
    logo: "https://www.aci-bd.com/images/logo.png",
    headquarters: "Dhaka, Bangladesh",
    founded: 1968,
    description: "ACI Limited is one of the largest conglomerates in Bangladesh with business in pharmaceuticals, consumer brands, and agribusiness.",
    revenue: "$400 million",
    employees: 7000,
    website: "https://www.aci-bd.com",
    ceo: "Arif Dowla"
  },
  {
    id: "7",
    name: "Robi Axiata",
    sector: "Telecommunications",
    logo: "https://www.robi.com.bd/static/media/robi.5b093b53.svg",
    headquarters: "Dhaka, Bangladesh",
    founded: 1997,
    description: "Robi Axiata Limited is the second largest mobile network operator in Bangladesh.",
    revenue: "$900 million",
    employees: 1500,
    website: "https://www.robi.com.bd",
    ceo: "Mahtab Uddin Ahmed"
  },
  {
    id: "8",
    name: "PRAN-RFL Group",
    sector: "Food & Beverage",
    logo: "https://pranfoods.net/images/logos/pran_s.png",
    headquarters: "Dhaka, Bangladesh",
    founded: 1981,
    description: "PRAN-RFL Group is one of the largest food and beverage manufacturers and exporters in Bangladesh.",
    revenue: "$1.2 billion",
    employees: 85000,
    website: "https://www.pranfoods.net",
    ceo: "Ahsan Khan Chowdhury"
  }
];

// Local storage keys
const TOKEN_KEY = "bd_companies_auth_token";
const USER_KEY = "bd_companies_user";

// Mock user for authentication
const ADMIN_USER: User = {
  username: "admin",
  password: "admin123"
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(TOKEN_KEY) !== null;
};

// Get stored user
export const getUser = (): { username: string } | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Get auth token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Login function
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    const response: AuthResponse = {
      token: "mock-jwt-token-" + Math.random().toString(36).substring(2, 15),
      user: {
        username
      }
    };
    
    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    
    return response;
  } else {
    throw { message: "Invalid username or password", status: 401 } as ApiError;
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Get all companies
export const getCompanies = async (): Promise<Company[]> => {
  // Simulate API call
  return simulateFetch(mockCompanies);
};

// Get company by ID
export const getCompanyById = async (id: string): Promise<Company | null> => {
  // Simulate API call
  const company = mockCompanies.find(c => c.id === id);
  return simulateFetch(company || null);
};

// Create new company (requires auth)
export const createCompany = async (company: Company): Promise<Company> => {
  // Check auth
  if (!isAuthenticated()) {
    throw { message: "Unauthorized", status: 401 } as ApiError;
  }
  
  // Simulate API call
  const newCompany = {
    ...company,
    id: Date.now().toString()
  };
  
  // Add to mock data
  mockCompanies.push(newCompany);
  return simulateFetch(newCompany);
};

// Update company (requires auth)
export const updateCompany = async (id: string, company: Company): Promise<Company> => {
  // Check auth
  if (!isAuthenticated()) {
    throw { message: "Unauthorized", status: 401 } as ApiError;
  }
  
  // Simulate API call
  const index = mockCompanies.findIndex(c => c.id === id);
  if (index === -1) {
    throw { message: "Company not found", status: 404 } as ApiError;
  }
  
  const updatedCompany = {
    ...mockCompanies[index],
    ...company,
    id
  };
  
  mockCompanies[index] = updatedCompany;
  return simulateFetch(updatedCompany);
};

// Delete company (requires auth)
export const deleteCompany = async (id: string): Promise<void> => {
  // Check auth
  if (!isAuthenticated()) {
    throw { message: "Unauthorized", status: 401 } as ApiError;
  }
  
  // Simulate API call
  const index = mockCompanies.findIndex(c => c.id === id);
  if (index === -1) {
    throw { message: "Company not found", status: 404 } as ApiError;
  }
  
  mockCompanies.splice(index, 1);
  return simulateFetch(undefined);
};
