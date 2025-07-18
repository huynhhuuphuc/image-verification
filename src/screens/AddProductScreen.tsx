import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Camera,
  Package,
  Save,
  X,
  Menu,
  ImageIcon
} from 'lucide-react';
import { mockCategories } from '../data/mockData';

interface AddProductScreenProps {
  onToggleSidebar: () => void;
}

const AddProductScreen: React.FC<AddProductScreenProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: ''
  });

  const [images, setImages] = useState({
    representative: null as string | null,
    sample: null as string | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (type: 'representative' | 'sample') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => ({ ...prev, [type]: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type: 'representative' | 'sample') => {
    setImages(prev => ({ ...prev, [type]: null }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }

    if (!formData.category) {
      newErrors.category = 'Danh mục là bắt buộc';
    }

    if (!images.representative) {
      newErrors.representative = 'Ảnh đại diện là bắt buộc';
    }

    if (!images.sample) {
      newErrors.sample = 'Ảnh mẫu thiết kế là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate back to products list with success message
      navigate('/products', {
        state: {
          message: `Sản phẩm "${formData.name}" đã được thêm thành công!`,
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = mockCategories.filter(cat => cat.id !== 'all');

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
          <h1 className="text-lg font-bold text-gray-900">Thêm sản phẩm</h1>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
            <p className="text-gray-600 text-sm sm:text-base">Tạo sản phẩm mới cho hệ thống kiểm tra nhãn mác</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm..."
                  className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full h-[46px] rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
      ${errors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
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
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Hình ảnh sản phẩm</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Representative Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ảnh đại diện <span className="text-red-500">*</span>
                </label>
                {!images.representative ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Tải lên ảnh đại diện</p>
                    <p className="text-xs text-gray-500 mb-3">PNG, JPG lên đến 10MB</p>
                    <label className="btn-primary cursor-pointer text-sm flex items-center justify-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Chọn ảnh
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload('representative')}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={images.representative}
                      alt="Ảnh đại diện"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('representative')}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {errors.representative && (
                  <p className="mt-1 text-xs text-red-600">{errors.representative}</p>
                )}
              </div>

              {/* Sample Design Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ảnh mẫu thiết kế <span className="text-red-500">*</span>
                </label>
                {!images.sample ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Tải lên ảnh mẫu thiết kế</p>
                    <p className="text-xs text-gray-500 mb-3">PNG, JPG lên đến 10MB</p>
                    <label className="btn-primary cursor-pointer text-sm flex items-center justify-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Chọn ảnh
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload('sample')}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={images.sample}
                      alt="Ảnh mẫu thiết kế"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('sample')}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {errors.sample && (
                  <p className="mt-1 text-xs text-red-600">{errors.sample}</p>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-700">
                <strong>Lưu ý:</strong> Ảnh đại diện sẽ hiển thị trong danh sách sản phẩm. Ảnh mẫu thiết kế là chuẩn để so sánh với ảnh in thực tế.
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
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang thêm...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Thêm sản phẩm
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductScreen; 