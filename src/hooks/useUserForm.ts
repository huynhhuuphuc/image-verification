import { useState, useEffect, useCallback } from "react";
import { getListAllUsers, removeUser } from "../src/api/apiServer/apiUser";
import toast from "react-hot-toast";
import ROLE from "../src/utils/role";
import { useToastQueue } from "../src/utils/showToast";

interface UseUserFormProps {
  usersPerPage?: number;
}

interface UseUserFormReturn {
  // Data
  users: Api.UserProps[];
  totalUsers: number;
  currentPage: number;

  // Loading states
  isLoading: boolean;
  isDeleting: boolean;

  // Error state
  error: string | null;

  // Actions
  fetchUsers: (
    page?: number,
    limit?: number,
    role?: "ADMIN" | "EMPLOYEE",
    keyword?: string
  ) => Promise<void>;
  deleteUser: (email: string) => Promise<void>;
  refreshUsers: (role?: "ADMIN" | "EMPLOYEE", keyword?: string) => void;
  setCurrentPage: (page: number) => void;

  // Computed values
  stats: {
    total: number;
    administrators: number;
    employees: number;
    totalFromAPI: number;
    showingAllUsers: boolean;
  };
}

export const useUserForm = ({
  usersPerPage = 50,
}: UseUserFormProps = {}): UseUserFormReturn => {
  const { showToastAndWait } = useToastQueue();
  const [users, setUsers] = useState<Api.UserProps[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(
    async (
      page: number = currentPage,
      limit: number = usersPerPage,
      role?: "ADMIN" | "EMPLOYEE",
      keyword?: string
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const params: Api.ListParams = {
          skip: (page - 1) * limit,
          limit: limit,
          ...(role && { role }),
          ...(keyword && { keyword }),
        };

        const response = await getListAllUsers(params);

        setUsers(response.users || []);
        setTotalUsers(response.total || 0);
      } catch (error) {
        setError("Không thể tải danh sách nhân viên. Vui lòng thử lại.");
        toast.error("Lỗi khi tải danh sách nhân viên");
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, usersPerPage]
  );

  const deleteUser = async (email: string) => {
    setIsDeleting(true);
    try {
      await removeUser(email);
      await showToastAndWait("Đã xóa nhân viên thành công", "success");
      await fetchUsers(currentPage, usersPerPage);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error("Có lỗi xảy ra khi xóa nhân viên");
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const refreshUsers = useCallback(
    (role?: "ADMIN" | "EMPLOYEE", keyword?: string) => {
      fetchUsers(currentPage, usersPerPage, role, keyword);
    },
    [fetchUsers, currentPage, usersPerPage]
  );

  // Calculate statistics
  const stats = {
    total: users.length,
    administrators: users.filter((user) => user.role === ROLE.ADMIN).length,
    employees: users.filter((user) => user.role === ROLE.EMPLOYEE).length,
    totalFromAPI: totalUsers,
    showingAllUsers: users.length === totalUsers,
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    // Data
    users,
    totalUsers,
    currentPage,

    // Loading states
    isLoading,
    isDeleting,

    // Error state
    error,

    // Actions
    fetchUsers,
    deleteUser,
    refreshUsers,
    setCurrentPage,

    // Computed values
    stats,
  };
};
