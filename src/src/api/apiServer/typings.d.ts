declare namespace Api {
  interface ListParams {
    skip: number;
    limit: number;
    role?: string;
  }
  interface ProductParams {
    skip: number;
    limit: number;
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
    };
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
  };
  type UserByEmailProps = {
    email: string;
    employee_code: string;
    name: string;
    role: string;
    avatar_url: string;
  };
  type UploadResponse = {
    id: number;
    file_path: string;
    file_url: string;
  };
  type ProductResponse = {
    status: string;
    message: string;
    data: {
      products: ProductProps[];
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    };
    error_code: string;
  };
  type ProductProps = {
    id: number;
    product_code: string;
    name: string;
    category: string;
    avatar: {
      path: string;
      public_url: string;
    };
    created_at: string;
  };
}
