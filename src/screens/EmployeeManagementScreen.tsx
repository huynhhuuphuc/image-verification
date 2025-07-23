import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  User,
  Shield,
  Mail,
  MoreVertical,
  Menu,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import ROLE from "../src/utils/role";
import { formatJoinDate } from "../src/utils/validation";
import UserModal from "../components/UserModal";
import RemoveUserModal from "../components/RemoveUserModal";
import { useToastQueue } from "../src/utils/showToast";
import { useUserForm } from "../hooks/useUserForm";

interface EmployeeManagementScreenProps {
  onToggleSidebar: () => void;
}

const EmployeeManagementScreen: React.FC<EmployeeManagementScreenProps> = ({
  onToggleSidebar,
}) => {
  // Custom hook for user management
  const {
    users,
    isLoading,
    isDeleting,
    error,
    deleteUser,
    refreshUsers,
    stats,
  } = useUserForm({ usersPerPage: 50 });

  // Local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "All" | "ADMIN" | "EMPLOYEE"
  >("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [checkIsEdit, setCheckIsEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState<Api.UserProps | null>(null);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Api.UserProps | null>(null);
  const { showToastAndWait } = useToastQueue();
  // Dropdown menu state
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const roleColors: Record<string, string> = {
    [ROLE.ADMIN]: "bg-purple-100 text-purple-800",
    [ROLE.EMPLOYEE]: "bg-blue-100 text-blue-800",
  };

  const roleIcons: Record<string, typeof Shield | typeof User> = {
    [ROLE.ADMIN]: Shield,
    [ROLE.EMPLOYEE]: User,
  };

  const handleAddUser = () => {
    setUserToEdit(null); // Reset any previously selected user
    setIsAddModalOpen(true);
    setCheckIsEdit(false);
  };

  const handleEditUser = (user: Api.UserProps) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
    setCheckIsEdit(true);
  };

  const handleUserAdded = async () => {
    const message = checkIsEdit
      ? "Thông tin nhân viên đã được cập nhật"
      : "Nhân viên mới đã được thêm thành công";
    await showToastAndWait(message, "success");
    // Reset states
    setUserToEdit(null);
    setCheckIsEdit(false);

    // Refresh user list
    refreshUsers();
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setUserToEdit(null);
    setCheckIsEdit(false);
  };

  const handleDeleteUser = (user: Api.UserProps) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    await deleteUser(userToDelete.email);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const toggleDropdown = (userId: number) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
    };

    if (openDropdownId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openDropdownId]);

  const handleRefresh = () => {
    refreshUsers();
  };

  const getRoleDisplayName = (role: string) => {
    return role === ROLE.ADMIN ? "Quản trị viên" : "Nhân viên";
  };

  const handleSendEmail = (
    e: React.MouseEvent<HTMLButtonElement>,
    email: string
  ) => {
    e.preventDefault();
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
    window.open(gmailLink, "_blank");
  };

  useEffect(() => {
    const roleParam =
      selectedRole === "All"
        ? undefined
        : (selectedRole as "ADMIN" | "EMPLOYEE");
    refreshUsers(roleParam, debouncedSearchTerm);
  }, [selectedRole, debouncedSearchTerm, refreshUsers]);

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    // Set searching state when user is typing
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  return (
    <div className="w-full min-h-full">
      <div className="mobile-container py-4 sm:py-6 max-w-7xl mx-auto pb-8">
        {/* Mobile Header with Hamburger */}
        <div className="flex items-center justify-between mb-6 bg-white sticky top-0 z-10 sm:hidden">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Nhân viên</h1>
          <div className="w-10"></div>
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Quản lý nhân viên
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Theo dõi, phân quyền và quản lý danh sách nhân viên sử dụng hệ
                thống
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleAddUser}
                className="btn-primary flex items-center space-x-2 animate-bounce-in w-full sm:w-auto justify-center"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm nhân viên</span>
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              {isSearching ? (
                <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5 animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              )}
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc mã nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Lọc theo vai trò:</span>
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex flex-wrap gap-2">
            {(["All", ROLE.ADMIN, ROLE.EMPLOYEE] as const).map((role) => (
              <button
                key={role}
                onClick={() =>
                  setSelectedRole(role as "All" | "ADMIN" | "EMPLOYEE")
                }
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedRole === role
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {role === "All" ? "Tất cả" : getRoleDisplayName(role)}
                {role === "All" && ` (${stats.totalFromAPI})`}
                {role === ROLE.ADMIN && ` (${stats.administrators})`}
                {role === ROLE.EMPLOYEE && ` (${stats.employees})`}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Info */}
        {(debouncedSearchTerm || selectedRole !== "All") &&
          !isLoading &&
          !error && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                {isSearching && (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                )}
                <p className="text-sm text-blue-800">
                  {isSearching ? (
                    "Đang tìm kiếm..."
                  ) : (
                    <>
                      Hiển thị {users.length} kết quả
                      {debouncedSearchTerm && ` cho "${debouncedSearchTerm}"`}
                      {selectedRole !== "All" &&
                        ` với vai trò ${getRoleDisplayName(selectedRole)}`}{" "}
                      trong {users.length} nhân viên đã tải.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải danh sách nhân viên...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="ml-auto btn-secondary text-sm"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Users Grid */}
        {!isLoading && !error && (
          <div className="mobile-grid mb-6 sm:mb-8">
            {users.map((user, index) => {
              const RoleIcon = roleIcons[user.role] || User;
              return (
                <div
                  key={user.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {user.avatar && user.avatar.public_url ? (
                          <img
                            src={user.avatar.public_url}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              // Handle broken image by showing default avatar
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                        ) : null}
                        <User
                          className={`w-6 h-6 text-gray-500 ${
                            user.avatar && user.avatar.public_url
                              ? "hidden"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {user.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-blue-600 truncate">
                          {user.employee_code}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(user.id);
                        }}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdownId === user.id && (
                        <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            {/* <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditUser(user);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <User className="w-4 h-4 mr-3 text-gray-500" />
                              Chỉnh sửa thông tin
                            </button> */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-3 text-red-500" />
                              Xóa nhân viên
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <RoleIcon className="w-4 h-4 text-gray-500" />
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          roleColors[user.role] || roleColors[ROLE.EMPLOYEE]
                        }`}
                      >
                        {getRoleDisplayName(user.role)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-600">Hoạt động</span>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">Tham gia:</span>
                      <span className="font-medium text-gray-900 truncate ml-2">
                        {formatJoinDate(user.created_at || "")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      className="flex-1 btn-secondary text-xs sm:text-sm py-2 flex items-center justify-center"
                      onClick={(e) => handleSendEmail(e, user.email)}
                    >
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Liên hệ
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="flex-1 btn-primary text-xs sm:text-sm py-2"
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && users.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy nhân viên
            </h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              {debouncedSearchTerm || selectedRole !== "All"
                ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc vai trò"
                : "Chưa có nhân viên nào trong hệ thống"}
            </p>
            {(debouncedSearchTerm || selectedRole !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDebouncedSearchTerm("");
                  setSelectedRole("All");
                }}
                className="btn-secondary"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* Statistics */}
        {!isLoading && !error && users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs sm:text-sm">
                    Tổng nhân viên
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {stats.totalFromAPI}
                  </p>
                  <p className="text-blue-100 text-xs mt-1">
                    {stats.showingAllUsers
                      ? "Đang hiển thị tất cả"
                      : `Hiển thị ${stats.total}/${stats.totalFromAPI}`}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-xs sm:text-sm">
                    Quản trị viên
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {stats.administrators}
                  </p>
                  <p className="text-purple-100 text-xs mt-1">
                    {stats.showingAllUsers
                      ? "Toàn quyền"
                      : "Trong trang hiện tại"}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 md:col-span-1 col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs sm:text-sm">Nhân viên</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {stats.employees}
                  </p>
                  <p className="text-green-100 text-xs mt-1">
                    {stats.showingAllUsers
                      ? "Quyền hạn chế"
                      : "Trong trang hiện tại"}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleAddUser}
              className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-left"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  Thêm nhân viên mới
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Mời người dùng tham gia hệ thống
                </p>
              </div>
            </button>

            {/* <button className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  Quản lý quyền hạn
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Phân quyền cho người dùng
                </p>
              </div>
            </button> */}

            <button
              onClick={handleRefresh}
              className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-left"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Loader2
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-green-600 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  Làm mới dữ liệu
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Cập nhật danh sách nhân viên
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={handleCloseModal}
        onUserAdded={handleUserAdded}
        userToEdit={userToEdit}
        checkIsEdit={checkIsEdit}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <RemoveUserModal
          handleCancelDelete={handleCancelDelete}
          userToDelete={userToDelete}
          isDeleting={isDeleting}
          handleConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default EmployeeManagementScreen;
