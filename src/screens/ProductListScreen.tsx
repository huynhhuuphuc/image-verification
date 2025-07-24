import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Eye,
  Menu,
  Trash2,
  Pencil,
  MoreVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORY_LABELS } from "../data/mockData";
import { useProductForm } from "../hooks/useProductForm";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { getCookie } from "../src/utils/cookie";
import { CURRENT_USER } from "../src/constants/cookie";
import RemoveProductModal from "../components/RemoveProductModal";

interface ProductListScreenProps {
  onToggleSidebar: () => void;
}

const ProductListScreen: React.FC<ProductListScreenProps> = ({
  onToggleSidebar,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "FOOD" | "BEVERAGE" | "SNACK" | "FROZEN" | "FRESH" | "OTHER"
  >("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const currentUser = getCookie(CURRENT_USER);
  const isAdmin = useIsAdmin(currentUser);
  const {
    products,
    totalProducts,
    currentPage,
    isLoading,
    isDeleting,
    error,
    fetchProducts,
    deleteProduct,
    refreshProducts,
    stats,
  } = useProductForm();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<Api.ProductProps | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  useEffect(() => {
    const category = selectedCategory === "All" ? undefined : selectedCategory;
    refreshProducts(category, debouncedSearchTerm);
  }, [selectedCategory, debouncedSearchTerm, refreshProducts]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleEditProduct = (product: Api.ProductProps) => {
    navigate(`/products/product-form?productId=${product.product_code}`);
  };

  const handleDeleteProduct = (product: Api.ProductProps) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      const result = await deleteProduct(productToDelete.product_code);
      if (result.success) {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleRefresh = () => {
    const category = selectedCategory === "All" ? undefined : selectedCategory;
    refreshProducts(category, debouncedSearchTerm);
  };

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
          <h1 className="text-lg font-bold text-gray-900">Sản phẩm</h1>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Quản lý sản phẩm
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Theo dõi và quản lý danh sách sản phẩm kiểm tra nhãn mác in ấn
              </p>
            </div>

            <Link
              to="/products/product-form"
              className="btn-primary flex items-center space-x-2 animate-bounce-in w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              <span>Thêm sản phẩm</span>
            </Link>
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
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Lọc theo danh mục:</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full overflow-x-auto">
            <div className="inline-flex gap-2 pb-2 min-w-max">
              {(
                [
                  "All",
                  "FOOD",
                  "BEVERAGE",
                  "SNACK",
                  "FROZEN",
                  "FRESH",
                  "OTHER",
                ] as const
              ).map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(
                      category as
                        | "All"
                        | "FOOD"
                        | "BEVERAGE"
                        | "SNACK"
                        | "FROZEN"
                        | "FRESH"
                        | "OTHER"
                    )
                  }
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {CATEGORY_LABELS[category]}
                  {category === "All" && ` (${stats.totalFromAPI})`}
                  {category === "FOOD" && ` (${stats.categoriesCount.FOOD})`}
                  {category === "BEVERAGE" &&
                    ` (${stats.categoriesCount.BEVERAGE})`}
                  {category === "SNACK" && ` (${stats.categoriesCount.SNACK})`}
                  {category === "FROZEN" &&
                    ` (${stats.categoriesCount.FROZEN})`}
                  {category === "FRESH" && ` (${stats.categoriesCount.FRESH})`}
                  {category === "OTHER" && ` (${stats.categoriesCount.OTHER})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results Info */}
        {(debouncedSearchTerm || selectedCategory !== "All") &&
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
                      Hiển thị {products.length} kết quả
                      {debouncedSearchTerm && ` cho "${debouncedSearchTerm}"`}
                      {selectedCategory !== "All" &&
                        ` với danh mục ${CATEGORY_LABELS[selectedCategory]}`}{" "}
                      trong {totalProducts} sản phẩm.
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
              <p className="text-gray-600">Đang tải danh sách sản phẩm...</p>
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

        {/* Product Grid */}
        {!isLoading && !error && (
          <div className="mobile-grid mb-6 sm:mb-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="relative card-hover animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-2">
                  <Link
                    to={`/products/${product.product_code}`}
                    className="block"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-3 sm:mb-4 bg-gray-100">
                      <img
                        src={product.sample_image.public_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 text-sm sm:text-base leading-tight">
                      {product.name}
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                      <span className="capitalize">
                        {
                          CATEGORY_LABELS[
                            product.category as keyof typeof CATEGORY_LABELS
                          ]
                        }
                      </span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{formatDate(new Date(product.created_at))}</span>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-600">
                        Đang hoạt động
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-primary-600 group-hover:text-primary-700">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">
                        Xem chi tiết
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex gap-2 border-t pt-3 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProduct(product);
                        }}
                        className="flex-1 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <Pencil className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product);
                        }}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              {debouncedSearchTerm || selectedCategory !== "All"
                ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục"
                : "Chưa có sản phẩm nào trong hệ thống"}
            </p>
            {(debouncedSearchTerm || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDebouncedSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="btn-secondary"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </div>
      {isDeleteModalOpen && productToDelete && (
        <RemoveProductModal
          handleCancelDelete={handleCancelDelete}
          productToDelete={productToDelete}
          isDeleting={isDeleting}
          handleConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default ProductListScreen;
