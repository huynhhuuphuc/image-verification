export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Administrator" | "Employee";
  company: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  sampleImage?: string; // Design template image
  category: string;
  createdAt: Date;
}

export interface InspectionResult {
  id: string;
  productId: string;
  status: "Passed" | "Error";
  timestamp: Date;
  aiAnalysis?: string;
  confidence?: number;
  differences?: string[];
  testImageUrl?: string;
  testImage?: string; // For backward compatibility
  standardImage?: string;
  inspector?: string;
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
