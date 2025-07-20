import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Shield,
  UserPlus,
  Upload,
  Camera,
  Edit,
} from "lucide-react";
import { createUserByEmail, updateUser } from "../src/api/apiServer/apiUser";
import ROLE from "../src/utils/role";
import toast from "react-hot-toast";
import { uploadFile } from "../src/api/apiServer/apiUpload";
import { emailPattern } from "../src/utils/validation";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
  checkIsEdit: boolean;
  userToEdit: Api.UserProps | null;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onUserAdded,
  checkIsEdit,
  userToEdit,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    employee_code: "",
    role: ROLE.EMPLOYEE,
    avatar_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<{
    representative: File | null;
  }>({
    representative: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Populate form with user data when editing
  useEffect(() => {
    if (checkIsEdit && userToEdit) {
      console.log("userToEdit", userToEdit);
      setFormData({
        email: userToEdit.email,
        name: userToEdit.name,
        employee_code: userToEdit.employee_code,
        role: userToEdit.role,
        avatar_url: userToEdit.avatar_url || "",
      });
    } else {
      // Reset form for adding new user
      setFormData({
        email: "",
        name: "",
        employee_code: "",
        role: ROLE.EMPLOYEE,
        avatar_url: "",
      });
    }
    // Reset images when opening modal
    setImages({ representative: null });
    setImagePreview(null);
  }, [checkIsEdit, userToEdit, isOpen]);

  const handleImageUpload =
    (type: "representative") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Store the file
        setImages((prev) => ({
          ...prev,
          [type]: file,
        }));

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateEmployeeCode = () => {
    const randomCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    setFormData((prev) => ({
      ...prev,
      employee_code: `EMP_${randomCode}`,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.name ||
      !formData.employee_code ||
      !emailPattern.test(formData.email)
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc và email hợp lệ");
      return;
    }

    setIsLoading(true);

    try {
      let finalAvatarUrl = formData.avatar_url; // Keep existing avatar if no new one

      // Upload new image if selected
      if (images.representative) {
        try {
          console.log("Uploading new image...");
          const response = await uploadFile(images.representative, "users");
          console.log("Upload response:", response);
          finalAvatarUrl = response.file_path;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          toast.error("Lỗi khi tải lên ảnh. Vui lòng thử lại.");
          setIsLoading(false);
          return; // Stop execution if image upload fails
        }
      }

      const dataToSend = {
        ...formData,
        avatar_url: finalAvatarUrl,
      };

      if (checkIsEdit && userToEdit) {
        // Update existing user
        const updateData: Api.UserUpdateProps = {
          email: dataToSend.email,
          name: dataToSend.name,
          role: dataToSend.role,
          avatar_url: finalAvatarUrl, // Use the processed avatar URL
        };
        console.log("Updating user:", userToEdit.id, "with data:", updateData);
        await updateUser(updateData);
        toast.success("Cập nhật nhân viên thành công!");
      } else {
        // Create new user
        console.log("Creating new user with data:", dataToSend);
        await createUserByEmail(dataToSend);
        toast.success("Thêm nhân viên thành công!");
      }

      onUserAdded();
      onClose();

      // Reset form
      setFormData({
        email: "",
        name: "",
        employee_code: "",
        role: ROLE.EMPLOYEE,
        avatar_url: "",
      });
      setImages({ representative: null });
      setImagePreview(null);
    } catch (error: any) {
      console.error(
        `Error ${checkIsEdit ? "updating" : "creating"} user:`,
        error
      );
      toast.error(
        checkIsEdit
          ? "Có lỗi xảy ra khi cập nhật nhân viên"
          : "Có lỗi xảy ra khi thêm nhân viên"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form when closing
      setFormData({
        email: "",
        name: "",
        employee_code: "",
        role: ROLE.EMPLOYEE,
        avatar_url: "",
      });
      setImages({ representative: null });
      setImagePreview(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {checkIsEdit ? (
                    <Edit className="w-6 h-6 text-blue-600" />
                  ) : (
                    <UserPlus className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {checkIsEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {checkIsEdit
                      ? "Chỉnh sửa thông tin nhân viên"
                      : "Điền thông tin để thêm nhân viên vào hệ thống"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="user@example.com"
                    disabled={isLoading || checkIsEdit} // Disable email editing in edit mode
                  />
                </div>
                {checkIsEdit && (
                  <p className="text-xs text-gray-500 mt-1">
                    Email không thể thay đổi khi chỉnh sửa
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nguyễn Văn A"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Employee Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã nhân viên <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="employee_code"
                    required
                    value={formData.employee_code}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="EMP_12345678"
                    disabled={isLoading}
                  />
                  {!checkIsEdit && (
                    <button
                      type="button"
                      onClick={generateEmployeeCode}
                      disabled={isLoading}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Tạo tự động
                    </button>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  >
                    <option value={ROLE.EMPLOYEE}>Nhân viên</option>
                    <option value={ROLE.ADMIN}>Quản trị viên</option>
                  </select>
                </div>
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh đại diện {checkIsEdit && "(tùy chọn cập nhật)"}
                </label>

                {/* Show current avatar if editing and has avatar */}
                {checkIsEdit && formData.avatar_url && !imagePreview && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Ảnh hiện tại:</p>
                    <img
                      src={formData.avatar_url}
                      alt="Current avatar"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>
                )}

                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {checkIsEdit ? "Tải lên ảnh mới" : "Tải lên ảnh đại diện"}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      PNG, JPG lên đến 10MB
                    </p>
                    <label className="btn-primary cursor-pointer text-sm flex items-center justify-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Chọn ảnh
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload("representative")}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Ảnh đại diện mới"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImages((prev) => ({
                          ...prev,
                          representative: null,
                        }));
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !formData.email ||
                !formData.name ||
                !formData.employee_code
              }
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {checkIsEdit ? "Đang cập nhật..." : "Đang thêm..."}
                </>
              ) : checkIsEdit ? (
                "Cập nhật nhân viên"
              ) : (
                "Thêm nhân viên"
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
