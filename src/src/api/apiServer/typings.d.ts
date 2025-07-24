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
}
