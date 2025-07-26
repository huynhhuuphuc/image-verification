import React, { useState, useEffect } from "react";
import {
  Calendar,
  Package,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Filter,
  Menu,
  X,
  Search,
  Loader2,
} from "lucide-react";
import { UserFirebase } from "../types";
import { useDashboard } from "../hooks/useDashboard";
import useDebounce from "../hooks/useDebounce";

interface HomeScreenProps {
  user: UserFirebase | null;
  onToggleSidebar: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, onToggleSidebar }) => {
  // Local state for immediate input updates (before debouncing)
  const [localProductCodeInput, setLocalProductCodeInput] = useState("");
  const [localInspectorEmailInput, setLocalInspectorEmailInput] = useState("");
  const [localKeywordInput, setLocalKeywordInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedProductCode = useDebounce(localProductCodeInput, 500);
  const debouncedInspectorEmail = useDebounce(localInspectorEmailInput, 500);
  const debouncedKeyword = useDebounce(localKeywordInput, 500);

  // Dashboard hook
  const {
    dashboardData,
    isLoading,
    isRefreshing,
    error,
    dateRange,
    productCodeFilter,
    inspectorEmailFilter,
    keywordFilter,
    refreshDashboard,
    setDateRange,
    setProductCodeFilter,
    setInspectorEmailFilter,
    setKeywordFilter,
    clearFilters,
    stats,
    topFailedProducts,
    recentActivities,
    hasActiveFilters,
  } = useDashboard();

  // Update the hook filters when debounced values change
  useEffect(() => {
    setProductCodeFilter(debouncedProductCode);
  }, [debouncedProductCode, setProductCodeFilter]);

  useEffect(() => {
    setInspectorEmailFilter(debouncedInspectorEmail);
  }, [debouncedInspectorEmail, setInspectorEmailFilter]);

  useEffect(() => {
    setKeywordFilter(debouncedKeyword);
  }, [debouncedKeyword, setKeywordFilter]);

  const handleClearFilters = () => {
    // Clear local inputs
    setLocalProductCodeInput("");
    setLocalInspectorEmailInput("");
    setLocalKeywordInput("");
    setShowFilters(false);
    // Clear hook filters
    clearFilters();
  };

  const statsCards = [
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      bgColor: "bg-blue-500",
    },
    {
      title: "Tổng kiểm tra",
      value: stats.totalInspections,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
      bgColor: "bg-green-500",
    },
    {
      title: "Kiểm tra thành công",
      value: stats.successfulInspections,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
      bgColor: "bg-emerald-500",
    },
    {
      title: "Phát hiện lỗi",
      value: stats.errorInspections,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      bgColor: "bg-red-500",
    },
  ];

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
          <h1 className="text-lg font-bold text-gray-900">Tổng quan</h1>
          <button
            onClick={refreshDashboard}
            disabled={isLoading || isRefreshing}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
          >
            <Loader2
              className={`w-5 h-5 text-gray-600 ${
                isLoading || isRefreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && !dashboardData && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Đang tải dữ liệu dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Lỗi tải dữ liệu
                </p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <button
                onClick={refreshDashboard}
                disabled={isLoading || isRefreshing}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Main Content - Only show when not in initial loading state */}
        {(!isLoading || dashboardData) && !error && (
          <>
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Chào mừng trở lại,{" "}
                    <span className="text-primary-600">
                      {dashboardData?.user?.name ||
                        user?.displayName ||
                        "Saigonfood"}
                      !
                    </span>{" "}
                    👋
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Tổng quan hoạt động kiểm định nhãn mác in ấn
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Date Range Filter */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-white rounded-lg border border-gray-200 p-2 sm:px-4 sm:py-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div className="flex items-center space-x-2 text-xs sm:text-sm">
                      <input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            from: e.target.value,
                          })
                        }
                        className="border-none outline-none bg-transparent"
                      />
                      <span className="text-gray-400">đến</span>
                      <input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            to: e.target.value,
                          })
                        }
                        className="border-none outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Filter Toggle Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors duration-200 text-xs sm:text-sm ${
                      showFilters
                        ? "bg-primary-50 border-primary-200 text-primary-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Lọc</span>
                    {hasActiveFilters && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    )}
                  </button>

                  {/* Clear Filters Button */}
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                      <span>Xóa bộ lọc</span>
                    </button>
                  )}

                  {/* Refresh Button */}
                  <button
                    onClick={refreshDashboard}
                    disabled={isLoading || isRefreshing}
                    className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm disabled:opacity-50"
                    title="Làm mới dữ liệu"
                  >
                    <Loader2
                      className={`w-4 h-4 ${
                        isLoading || isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                    <span>Làm mới</span>
                  </button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Product Code Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tìm kiếm mã sản phẩm
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={localProductCodeInput}
                          onChange={(e) =>
                            setLocalProductCodeInput(e.target.value)
                          }
                          placeholder="Nhập mã sản phẩm..."
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Inspector Email Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tìm kiếm email người kiểm tra
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={localInspectorEmailInput}
                          onChange={(e) =>
                            setLocalInspectorEmailInput(e.target.value)
                          }
                          placeholder="Nhập email người kiểm tra..."
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Keyword Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tìm kiếm từ khóa
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={localKeywordInput}
                          onChange={(e) => setLocalKeywordInput(e.target.value)}
                          placeholder="Nhập từ khóa..."
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Summary */}
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">Kết quả hiện tại:</span>{" "}
                    {stats.totalInspections} kiểm tra
                    {productCodeFilter && (
                      <span>, Mã sản phẩm: "{productCodeFilter}"</span>
                    )}
                    {inspectorEmailFilter && (
                      <span>, Email: "{inspectorEmailFilter}"</span>
                    )}
                    {keywordFilter && <span>, Từ khóa: "{keywordFilter}"</span>}
                    {(localProductCodeInput !== debouncedProductCode ||
                      localInspectorEmailInput !== debouncedInspectorEmail ||
                      localKeywordInput !== debouncedKeyword) && (
                      <span className="text-amber-600">
                        {" "}
                        (đang tìm kiếm...)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="mobile-stats-grid mb-6 sm:mb-8">
              {statsCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-2 sm:p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 flex items-center">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                    <span className="text-xs sm:text-sm text-green-600 font-medium">
                      {stats.totalInspections > 0 ? "+5.2%" : "N/A"}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 ml-1 hidden sm:inline">
                      so với tuần trước
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Success Rate Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Tỷ lệ thành công
                  </h3>
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                    <svg
                      className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray={`${stats.successRate}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">
                          {stats.successRate}%
                        </div>
                        <div className="text-xs text-gray-500">Thành công</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-base sm:text-lg font-semibold text-green-600">
                      {stats.successfulInspections}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Đạt yêu cầu
                    </div>
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-semibold text-red-600">
                      {stats.errorInspections}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Có lỗi
                    </div>
                  </div>
                </div>
              </div>

              {/* High Error Products */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Sản phẩm lỗi nhiều nhất
                  </h3>
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </div>

                {topFailedProducts.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {topFailedProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${product.color}`}
                          ></div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-medium text-gray-900 block truncate">
                              {product.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              Mã: {product.id}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-red-600">
                          {product.errors} lỗi
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Không có sản phẩm lỗi trong khoảng thời gian này
                    </p>
                  </div>
                )}

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-amber-800">
                        Khuyến nghị
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Cần kiểm tra lại quy trình in ấn cho các sản phẩm có tỷ
                        lệ lỗi cao
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Hoạt động gần đây
              </h3>
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 sm:space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    >
                      <div className="text-xs sm:text-sm text-gray-500 w-10 sm:w-12 flex-shrink-0">
                        {activity.time}
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          activity.status === "success"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 block">
                          {activity.action}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 truncate block">
                          {activity.productName}
                        </span>
                        <span className="text-xs text-gray-400">
                          Mã kiểm tra: {activity.inspectionCode} • bởi{" "}
                          {activity.inspector}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Không có hoạt động trong khoảng thời gian này
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
