import {
  User,
  Product,
  InspectionResult,
  DashboardStats,
  ProductCategory,
} from "../types";

export const mockUser: User = {
  id: "1",
  name: "Nguyễn Văn An",
  email: "an.nguyen@saigonfood.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  role: "Administrator",
  company: "Saigonfood",
};

export const mockStats: DashboardStats = {
  totalProducts: 145,
  totalInspections: 2847,
  successfulInspections: 2634,
  errorInspections: 213,
};

export const mockCategories: ProductCategory[] = [
  { id: "all", name: "Tất cả", count: 145 },
  { id: "fresh-porridge", name: "Cháo tươi", count: 45 },
  { id: "instant-noodles", name: "Mì gói", count: 38 },
  { id: "seafood", name: "Hải sản", count: 62 },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Cháo Tôm Thịt Saigonfood 240g",
    category: "fresh-porridge",
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Mì Gói Tôm Chua Cay 75g",
    category: "instant-noodles",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Tôm Khô Cao Cấp 150g",
    category: "seafood",
    image:
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "4",
    name: "Cháo Gà Nấm Hương 240g",
    category: "fresh-porridge",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2024-01-22"),
  },
  {
    id: "5",
    name: "Mực Khô Cắt Lát 100g",
    category: "seafood",
    image:
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "6",
    name: "Mì Gói Bò Hầm 80g",
    category: "instant-noodles",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2024-01-28"),
  },
];

export const mockInspections: InspectionResult[] = [
  {
    id: "1",
    productId: "1",
    status: "Passed",
    timestamp: new Date("2024-01-30T10:30:00"),
    aiAnalysis:
      "Nhãn mác khớp hoàn toàn với mẫu thiết kế. Không phát hiện lỗi.",
  },
  {
    id: "2",
    productId: "1",
    status: "Error",
    timestamp: new Date("2024-01-29T14:15:00"),
    aiAnalysis:
      'Phát hiện lỗi: Thiếu ký tự trong từ "Protein" (hiển thị "Protei"). Màu sắc logo hơi mờ so với mẫu chuẩn.',
    differences: [
      'Thiếu ký tự "n" trong từ "Protein"',
      "Logo mờ hơn 15% so với mẫu chuẩn",
    ],
  },
  {
    id: "3",
    productId: "2",
    status: "Passed",
    timestamp: new Date("2024-01-28T16:45:00"),
    aiAnalysis:
      "Tất cả thông tin trên nhãn chính xác. QR code rõ ràng và có thể quét được.",
  },
];

export const mockEmployees: User[] = [
  mockUser,
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "binh.tran@saigonfood.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "Employee",
    company: "Saigonfood",
  },
  {
    id: "3",
    name: "Lê Văn Cường",
    email: "cuong.le@saigonfood.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "Employee",
    company: "Saigonfood",
  },
  {
    id: "4",
    name: "Nguyễn Thị Dung",
    email: "dung.nguyen@saigonfood.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "Administrator",
    company: "Saigonfood",
  },
];
