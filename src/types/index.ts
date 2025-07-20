export interface UserFirebase {
  // id: string;
  // name: string;
  // email: string;
  // photoURL: string;
  // role: "Administrator" | "Employee";
  // company: string;
  accessToken: string;
  auth: any;
  displayName: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: UserMetadata;
  phoneNumber: string | null;
  photoURL: string;
  proactiveRefresh: {
    user: {
      uid: string;
      email: string;
      emailVerified: boolean;
      displayName: string;
      isAnonymous: boolean;
      photoURL: string;
      providerData: {
        providerId: string;
        uid: string;
        displayName: string;
        email: string;
        phoneNumber: string | null;
        photoURL: string;
      }[];
      stsTokenManager: {
        refreshToken: string;
        accessToken: string;
        expirationTime: number;
      };
      createdAt: string;
      lastLoginAt: string;
      apiKey: string;
      appName: string;
      isRunning: boolean;
      timerId: any;
      errorBackoff: number;
    };
  };
  providerData: any[];
  providerId: string;
  reloadListener: any;
  reloadUserInfo: any;
  stsTokenManager: any;
  tenantId: string | null;
  uid: string;
  apiUserData?: Api.UserProps;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Administrator" | "Employee";
  company: string;
}

export interface UserMetadata {
  createdAt: string;
  lastLoginAt: string;
  lastSignInTime: string;
  creationTime: string;
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
