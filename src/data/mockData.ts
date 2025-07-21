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
    sampleImage:
      "https://nhsv.vn/uploadfile/source/Marketing%20material/something-landing-page/anh%20mau.jpg",
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
    confidence: 98,
    inspector: "Nguyễn Văn An",
    testImage:
      "https://nhsv.vn/uploadfile/source/Marketing%20material/something-landing-page/anh%20mau.jpg",
    standardImage:
      "https://nhsv.vn/uploadfile/source/Marketing%20material/something-landing-page/anh%20mau.jpg",
  },
  {
    id: "2",
    productId: "1",
    status: "Error",
    timestamp: new Date("2024-01-29T14:15:00"),
    aiAnalysis:
      'Phát hiện lỗi: Thiếu ký tự trong từ "Protein" (hiển thị "Protei"). Màu sắc logo hơi mờ so với mẫu chuẩn.',
    confidence: 85,
    inspector: "Trần Thị Bình",
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
    confidence: 96,
    inspector: "Lê Văn Cường",
  },
  {
    id: "4",
    productId: "2",
    status: "Error",
    timestamp: new Date("2024-01-27T09:15:00"),
    aiAnalysis: "Phát hiện lỗi màu sắc và vị trí logo không đúng chuẩn.",
    confidence: 78,
    inspector: "Hệ thống AI",
    differences: ["Màu logo sai 12%", "Vị trí logo lệch 3mm"],
  },
  {
    id: "5",
    productId: "3",
    status: "Passed",
    timestamp: new Date("2024-01-26T11:20:00"),
    aiAnalysis: "Kiểm tra thành công. Tất cả thông tin chính xác.",
    confidence: 94,
    inspector: "Nguyễn Thị Dung",
  },
  {
    id: "6",
    productId: "3",
    status: "Error",
    timestamp: new Date("2024-01-25T15:30:00"),
    aiAnalysis: "QR code bị mờ, khó quét được.",
    confidence: 82,
    inspector: "Trần Thị Bình",
    differences: ["QR code mờ 25%"],
  },
  {
    id: "7",
    productId: "4",
    status: "Passed",
    timestamp: new Date("2024-01-24T08:45:00"),
    aiAnalysis: "Nhãn mác đạt chuẩn, thông tin đầy đủ và chính xác.",
    confidence: 97,
    inspector: "Lê Văn Cường",
  },
  {
    id: "8",
    productId: "4",
    status: "Error",
    timestamp: new Date("2024-01-23T13:10:00"),
    aiAnalysis: "Thiếu thông tin ngày sản xuất.",
    confidence: 88,
    inspector: "Hệ thống AI",
    differences: ["Thiếu ngày sản xuất"],
  },
  {
    id: "9",
    productId: "5",
    status: "Passed",
    timestamp: new Date("2024-01-22T14:25:00"),
    aiAnalysis: "Kiểm tra hoàn tất. Không có lỗi phát hiện.",
    confidence: 95,
    inspector: "Nguyễn Văn An",
  },
  {
    id: "10",
    productId: "5",
    status: "Error",
    timestamp: new Date("2024-01-21T10:50:00"),
    aiAnalysis: "Font chữ không đúng chuẩn thiết kế.",
    confidence: 79,
    inspector: "Nguyễn Thị Dung",
    differences: ["Font chữ sai 15%"],
  },
  {
    id: "11",
    productId: "6",
    status: "Passed",
    timestamp: new Date("2024-01-20T16:15:00"),
    aiAnalysis: "Tất cả yếu tố nhãn mác đều chính xác.",
    confidence: 99,
    inspector: "Trần Thị Bình",
  },
  {
    id: "12",
    productId: "6",
    status: "Error",
    timestamp: new Date("2024-01-19T12:30:00"),
    aiAnalysis: "Màu nền không khớp với mẫu thiết kế.",
    confidence: 84,
    inspector: "Hệ thống AI",
    differences: ["Màu nền sai 8%"],
  },
  {
    id: "13",
    productId: "1",
    status: "Passed",
    timestamp: new Date("2024-01-18T09:40:00"),
    aiAnalysis: "Kiểm tra thành công, đạt tiêu chuẩn.",
    confidence: 93,
    inspector: "Lê Văn Cường",
  },
  {
    id: "14",
    productId: "2",
    status: "Error",
    timestamp: new Date("2024-01-17T11:55:00"),
    aiAnalysis: "Logo bị biến dạng nhẹ.",
    confidence: 86,
    inspector: "Nguyễn Thị Dung",
    differences: ["Logo biến dạng 5%"],
  },
  {
    id: "15",
    productId: "3",
    status: "Passed",
    timestamp: new Date("2024-01-16T15:20:00"),
    aiAnalysis: "Nhãn mác hoàn hảo, không có lỗi.",
    confidence: 98,
    inspector: "Nguyễn Văn An",
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
