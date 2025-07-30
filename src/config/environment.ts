interface EnvironmentConfig {
  NODE_ENV: string;
  API_BASE_URL: string;
  APP_NAME: string;
  DEBUG_MODE: boolean;
  FIREBASE_CONFIG: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

const developmentConfig: EnvironmentConfig = {
  NODE_ENV: "development",
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Image Verification - DEV",
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === "true" || true,
  FIREBASE_CONFIG: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  },
};

const uatConfig: EnvironmentConfig = {
  NODE_ENV: "uat",
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "https://uat-api.example.com/api",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Image Verification - UAT",
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === "true" || true,
  FIREBASE_CONFIG: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  },
};

const productionConfig: EnvironmentConfig = {
  NODE_ENV: "production",
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME || "Image Verification",
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === "true" || false,
  FIREBASE_CONFIG: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  },
};

const getEnvironmentConfig = (): EnvironmentConfig => {
  const nodeEnv =
    import.meta.env.NODE_ENV || process.env.NODE_ENV || "development";

  switch (nodeEnv) {
    case "development":
      return developmentConfig;
    case "uat":
      return uatConfig;
    case "production":
      return productionConfig;
    default:
      console.warn(
        `Unknown environment: ${nodeEnv}, falling back to development`
      );
      return developmentConfig;
  }
};

export const config = getEnvironmentConfig();
export default config;
