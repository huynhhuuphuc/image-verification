declare namespace Api {
  interface ListParams {
    skip: number;
    limit: number;
    role?: string;
    keyword?: string;
  }
  interface ProductParams {
    skip: number;
    limit: number;
    keyword?: string;
    category?: string;
  }
  type UserProps = {
    id: number;
    employee_code: string;
    name: string;
    email: string;
    role: string;
    avatar: {
      path: string;
      public_url: string;
    } | null;
    created_at?: string;
  };
  type UserUpdateProps = {
    email: string;
    name: string;
    role: string;
    avatar_url: string;
  };
  type ListUsersResponse = {
    users: UserProps[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
  type UserByEmailProps = {
    email: string;
    employee_code: string;
    name: string;
    role: string;
    avatar_url: string;
  };
  type UploadResponse = {
    content_type: string;
    file_path: string;
    filename: string;
    public_url: string;
    upload_type: string;
    uploaded_by: string;
  };
  type ProductResponse = {
    products: ProductProps[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
  type ProductProps = {
    id: number;
    product_code: string;
    name: string;
    category: string;
    descriptions: string;
    avatar: {
      path: string;
      public_url: string;
    };
    sample_image: {
      path: string;
      public_url: string;
    };
    created_at: string;
  };
  type ProductCreateProps = {
    product_code: string;
    name: string;
    category: string;
    descriptions: string;
    avatar_url: string;
    sample_image_url: string;
  };
  type ProductUpdateProps = {
    name: string;
    category: string;
    descriptions: string;
    avatar_url: string;
    sample_image_url: string;
  };
  type InspectionResponse = {
    inspections: InspectionProps[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
  type InspectionProps = {
    id: number;
    inspection_code: string;
    uploaded_image: {
      path: string;
      public_url: string;
    };
    sample_image: {
      path: string;
      public_url: string;
    };
    product_code: string;
    ai_conclusion: string;
    status: string;
    inspector_email: string;
    created_at: string;
  };
  type UploadInspectionAIProps = {
    filename: string;
    file_path: string;
    public_url: string;
    image_id: string;
    inspection_code: string;
    status: string;
  };
  type InspectionUploadAIProps = {
    uploaded_files: UploadInspectionAIProps[];
    failed_files: [];
    total_uploaded: number;
    total_failed: number;
    inspection_records: string[];
  };
  type DashboardParams = {
    start_date: string;
    end_date: string;
    product_code: string;
    keyword: string;
    inspector_email: string;
  };
  type DashboardResponse = {
    user: UserProps;
    metrics: {
      total_products: number;
      total_inspections: number;
      total_passed: number;
      total_failed: number;
    };
    top_failed_products: {
      product_code: string;
      name: string;
      category: string;
      failed_count: number;
    }[];
  };
}
