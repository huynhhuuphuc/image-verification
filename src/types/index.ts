export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "Administrator" | "Employee";
  company?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  createdAt: Date;
}

export interface InspectionResult {
  id: string;
  productId: string;
  status: "Passed" | "Error";
  timestamp: Date;
  aiAnalysis?: string;
  differences?: string[];
  testImageUrl?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalInspections: number;
  successfulInspections: number;
  errorInspections: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  count: number;
}
