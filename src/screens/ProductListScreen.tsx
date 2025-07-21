import React, { useState } from "react";
import { Plus, Search, Filter, Calendar, Eye, Menu } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { mockProducts, mockCategories } from "../data/mockData";

interface ProductListScreenProps {
  onToggleSidebar: () => void;
}

const ProductListScreen: React.FC<ProductListScreenProps> = ({
  onToggleSidebar,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="w-full min-h-full">
      <Outlet />
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
              to="/products/add"
              className="btn-primary flex items-center space-x-2 animate-bounce-in w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              <span>Thêm sản phẩm</span>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
              {mockCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mobile-grid mb-6 sm:mb-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="card-hover animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className="aspect-square rounded-lg overflow-hidden mb-3 sm:mb-4 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 text-sm sm:text-base leading-tight">
                    {product.name}
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                    <span className="capitalize">
                      {
                        mockCategories.find(
                          (cat) => cat.id === product.category
                        )?.name
                      }
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{formatDate(product.createdAt)}</span>
                    </div>
                  </div>

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
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="btn-secondary"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Statistics */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Tổng sản phẩm</p>
                <p className="text-xl sm:text-2xl font-bold">{mockProducts.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Đang hiển thị</p>
                <p className="text-xl sm:text-2xl font-bold">{filteredProducts.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 md:col-span-1 col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Danh mục</p>
                <p className="text-xl sm:text-2xl font-bold">{mockCategories.length - 1}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProductListScreen;
