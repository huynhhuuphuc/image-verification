declare namespace Api {
  interface ListParams {
    skip: number;
    limit: number;
  }
  type UserProps = {
    id: number;
    employee_code: string;
    name: string;
    email: string;
    role: string;
    avatar_url: string | null;
    created_at?: string;
  };
  type UserUpdateProps = {
    email: string;
    name: string;
    role: string;
    avatar_url: string | null;
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
}
