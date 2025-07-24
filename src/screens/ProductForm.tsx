import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Camera,
  Package,
  Save,
  X,
  Menu,
  ImageIcon,
} from "lucide-react";
import { mockCategories } from "../data/mockData";
import {
  createProduct,
  getProductByProductCode,
  updateProduct,
} from "../src/api/apiServer/apiProduct";
import { uploadFile } from "../src/api/apiServer/apiUpload";
import { useToastQueue } from "../src/utils/showToast";
import toast from "react-hot-toast";

interface ProductFormProps {
  onToggleSidebar: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToastAndWait } = useToastQueue();

  const productId = searchParams.get("productId");
  const isEditMode = Boolean(productId);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    descriptions: "",
    code: "",
    avatar_url: "",
    sample_image_url: "",
  });

  const [originalData, setOriginalData] = useState<Api.ProductProps | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const [images, setImages] = useState<{
    representative: File | null;
    sample: File | null;
  }>({
    representative: null,
    sample: null,
  });
  const [imagePreview, setImagePreview] = useState<{
    representative: string | null;
    sample: string | null;
  }>({
    representative: null,
    sample: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch product data when in edit mode
  useEffect(() => {
    const fetchProductData = async () => {
      if (isEditMode && productId) {
        setIsLoading(true);
        try {
          const productData = await getProductByProductCode(productId);
          console.log("productData", productData);
          setOriginalData(productData);
          setFormData({
            name: productData.name,
            category: productData.category,
            descriptions: productData.descriptions,
            code: productData.product_code,
            avatar_url: productData.avatar.public_url,
            sample_image_url: productData.sample_image.public_url,
          });

          // Set image previews with existing URLs
          setImagePreview({
            representative: productData.avatar.public_url,
            sample: productData.sample_image.public_url,
          });
        } catch (error) {
          console.error("Error fetching product:", error);
          await showToastAndWait("Lỗi khi tải thông tin sản phẩm", "error");
          navigate("/products");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProductData();
  }, [isEditMode, productId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload =
    (type: "representative" | "sample") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setImages((prev) => ({
          ...prev,
          [type]: file,
        }));
        const previewUrl = URL.createObjectURL(file);
        setImagePreview((prev) => ({
          ...prev,
          [type]: previewUrl,
        }));
        setImages((prev) => ({
          ...prev,
          [type]: file,
        }));
      }
    };

  const removeImage = (type: "representative" | "sample") => {
    setImages((prev) => ({ ...prev, [type]: null }));
    setImagePreview((prev) => ({ ...prev, [type]: null }));

    // Also clear the URL from form data if it's an existing image
    if (type === "representative") {
      setFormData((prev) => ({ ...prev, avatar_url: "" }));
    } else {
      setFormData((prev) => ({ ...prev, sample_image_url: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Mã sản phẩm là bắt buộc";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc";
    }

    if (!formData.category) {
      newErrors.category = "Danh mục là bắt buộc";
    }

    // Images are required only when creating new product
    if (!isEditMode) {
      if (!images.representative) {
        newErrors.representative = "Ảnh đại diện là bắt buộc";
      }

      if (!images.sample) {
        newErrors.sample = "Ảnh mẫu thiết kế là bắt buộc";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form data has changed from original
  const hasDataChanged = () => {
    if (!isEditMode || !originalData) return true;

    const hasTextChanged =
      formData.name !== originalData.name ||
      formData.category !== originalData.category ||
      formData.descriptions !== originalData.descriptions;

    const hasImageChanged =
      images.representative !== null ||
      images.sample !== null ||
      formData.avatar_url !== originalData.avatar.public_url ||
      formData.sample_image_url !== originalData.sample_image.public_url;

    return hasTextChanged || hasImageChanged;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check for changes in edit mode
    if (isEditMode && !hasDataChanged()) {
      toast.error("Thông tin chưa được chỉnh sửa", {
        duration: 2000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let finalAvatarUrl = formData.avatar_url;
      let finalSampleImageUrl = formData.sample_image_url;

      // Upload new images if provided
      if (images.representative) {
        const response = await uploadFile(images.representative, "products");
        finalAvatarUrl = response.file_path;
      }
      if (images.sample) {
        const response = await uploadFile(images.sample, "products");
        finalSampleImageUrl = response.file_path;
      }

      if (isEditMode && productId) {
        // Update existing product
        const requestBody: Api.ProductUpdateProps = {
          name: formData.name,
          category: formData.category,
          descriptions: formData.descriptions,
          avatar_url: images.representative
            ? finalAvatarUrl
            : originalData?.avatar?.path || "",
          sample_image_url: images.sample
            ? finalSampleImageUrl
            : originalData?.sample_image?.path || "",
        };
        await updateProduct(requestBody, productId);
        await showToastAndWait(
          `Sản phẩm "${formData.name}" đã được cập nhật thành công!`,
          "success"
        );
        navigate("/products");
      } else {
        // Create new product
        const requestBody: Api.ProductCreateProps = {
          product_code: formData.code,
          name: formData.name,
          category: formData.category,
          descriptions: formData.descriptions,
          avatar_url: finalAvatarUrl,
          sample_image_url: finalSampleImageUrl,
        };
        await createProduct(requestBody);
        await showToastAndWait(
          `Sản phẩm "${formData.name}" đã được thêm thành công!`,
          "success"
        );
        navigate("/products");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      const action = isEditMode ? "cập nhật" : "thêm";
      await showToastAndWait(`Lỗi khi ${action} sản phẩm`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = mockCategories;

  return (
    <div className="w-full min-h-full">
      <div className="mobile-container py-4 sm:py-6 max-w-4xl mx-auto pb-8">
        {/* Mobile Header with Hamburger and Back */}
        <div className="flex items-center justify-between mb-6 bg-white sticky top-0 z-10 sm:hidden">
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <Link
              to="/products"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
          <h1 className="text-lg font-bold text-gray-900">
            {isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex items-center space-x-4 mb-6">
          <Link
            to="/products"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {isEditMode
                ? "Cập nhật thông tin sản phẩm trong hệ thống kiểm tra nhãn mác"
                : "Tạo sản phẩm mới cho hệ thống kiểm tra nhãn mác"}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span className="text-gray-600">
              Đang tải thông tin sản phẩm...
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Thông tin cơ bản
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Product Code */}
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Nhập ID..."
                  disabled={isEditMode}
                  className={`input-field ${
                    isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
                  } ${
                    errors.code
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                {errors.code && (
                  <p className="mt-1 text-xs text-red-600">{errors.code}</p>
                )}
                {isEditMode && (
                  <p className="mt-1 text-xs text-gray-500">
                    ID sản phẩm không thể thay đổi
                  </p>
                )}
              </div>
              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm..."
                  className={`input-field ${
                    errors.name
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full h-[46px] rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
      ${
        errors.category
          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
          : ""
      }`}
                >
                  <option value="">Chọn danh mục...</option>
                  {availableCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="descriptions"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  id="descriptions"
                  name="descriptions"
                  value={formData.descriptions}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Nhập mô tả sản phẩm..."
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Hình ảnh sản phẩm
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Representative Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ảnh đại diện{" "}
                  {!isEditMode && <span className="text-red-500">*</span>}
                  {isEditMode && (
                    <span className="text-gray-500 text-xs">(tùy chọn)</span>
                  )}
                </label>
                {!images.representative && !imagePreview.representative ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Tải lên ảnh đại diện
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      jpeg, jpg, png lên đến 20MB
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
                      src={imagePreview.representative ?? undefined}
                      alt="Ảnh đại diện"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage("representative")}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {/* Add option to replace image */}
                    <label className="absolute bottom-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200">
                      <Camera className="w-3 h-3 inline mr-1" />
                      Thay đổi
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload("representative")}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
                {errors.representative && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.representative}
                  </p>
                )}
              </div>

              {/* Sample Design Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ảnh mẫu thiết kế{" "}
                  {!isEditMode && <span className="text-red-500">*</span>}
                  {isEditMode && (
                    <span className="text-gray-500 text-xs">(tùy chọn)</span>
                  )}
                </label>
                {!images.sample && !imagePreview.sample ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Tải lên ảnh mẫu thiết kế
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
                        onChange={handleImageUpload("sample")}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview.sample ?? undefined}
                      alt="Ảnh mẫu thiết kế"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage("sample")}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {/* Add option to replace image */}
                    <label className="absolute bottom-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200">
                      <Camera className="w-3 h-3 inline mr-1" />
                      Thay đổi
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload("sample")}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
                {errors.sample && (
                  <p className="mt-1 text-xs text-red-600">{errors.sample}</p>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-700">
                <strong>Lưu ý:</strong> Ảnh đại diện sẽ hiển thị trong danh sách
                sản phẩm. Ảnh mẫu thiết kế là chuẩn để so sánh với ảnh in thực
                tế.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              to="/products"
              className="btn-secondary flex items-center justify-center"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isEditMode ? "Đang cập nhật..." : "Đang thêm..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
