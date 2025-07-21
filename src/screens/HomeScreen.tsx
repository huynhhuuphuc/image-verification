import React, { useState, useMemo } from 'react';
import { Calendar, Package, CheckCircle, AlertTriangle, TrendingUp, Filter, Menu, X, Search } from 'lucide-react';
import { User, UserFirebase } from '../types';
import { mockStats, mockInspections, mockProducts, mockEmployees } from '../data/mockData';

interface HomeScreenProps {
  user: UserFirebase | null;
  onToggleSidebar: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, onToggleSidebar }) => {
  const [dateRange, setDateRange] = useState({
    from: '2024-01-16',
    to: '2024-01-31'
  });

  const [filters, setFilters] = useState({
    productId: '',
    tester: '',
    showFilters: false
  });

  // Get unique testers from inspections
  const availableTesters = useMemo(() => {
    const testers = [...new Set(mockInspections.map(i => i.inspector).filter(Boolean))];
    return testers.sort();
  }, []);

  // Filter inspections based on current filters
  const filteredInspections = useMemo(() => {
    return mockInspections.filter(inspection => {
      // Date filter
      const inspectionDate = new Date(inspection.timestamp);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Include full end date

      const withinDateRange = inspectionDate >= fromDate && inspectionDate <= toDate;

      // Product ID filter
      const matchesProductId = !filters.productId || inspection.productId === filters.productId;

      // Tester filter
      const matchesTester = !filters.tester || inspection.inspector === filters.tester;

      return withinDateRange && matchesProductId && matchesTester;
    });
  }, [dateRange, filters]);

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    const totalInspections = filteredInspections.length;
    const successfulInspections = filteredInspections.filter(i => i.status === 'Passed').length;
    const errorInspections = filteredInspections.filter(i => i.status === 'Error').length;

    // Get unique products from filtered inspections
    const uniqueProducts = [...new Set(filteredInspections.map(i => i.productId))];
    const totalProducts = uniqueProducts.length;

    return {
      totalProducts,
      totalInspections,
      successfulInspections,
      errorInspections
    };
  }, [filteredInspections]);

  // Calculate high error products from filtered data
  const highErrorProducts = useMemo(() => {
    const productErrors: { [key: string]: number } = {};

    filteredInspections.forEach(inspection => {
      if (inspection.status === 'Error') {
        productErrors[inspection.productId] = (productErrors[inspection.productId] || 0) + 1;
      }
    });

    return Object.entries(productErrors)
      .map(([productId, errors]) => {
        const product = mockProducts.find(p => p.id === productId);
        return {
          id: productId,
          name: product?.name || `Sản phẩm ${productId}`,
          errors,
          color: errors > 3 ? 'bg-red-400' : errors > 2 ? 'bg-orange-400' : errors > 1 ? 'bg-yellow-400' : 'bg-blue-400'
        };
      })
      .sort((a, b) => b.errors - a.errors)
      .slice(0, 4);
  }, [filteredInspections]);

  // Recent activities from filtered data
  const recentActivities = useMemo(() => {
    return filteredInspections
      .slice() // Make a copy to avoid mutating original array
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map(inspection => {
        const product = mockProducts.find(p => p.id === inspection.productId);
        return {
          time: inspection.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          action: inspection.status === 'Passed' ? 'Kiểm tra thành công' : 'Phát hiện lỗi',
          product: product?.name || `Sản phẩm ${inspection.productId}`,
          status: inspection.status === 'Passed' ? 'success' : 'error',
          tester: inspection.inspector
        };
      });
  }, [filteredInspections]);

  const clearFilters = () => {
    setFilters({
      productId: '',
      tester: '',
      showFilters: false
    });
    setDateRange({
      from: '2024-01-16',
      to: '2024-01-31'
    });
  };

  const stats = [
    {
      title: 'Tổng sản phẩm',
      value: filteredStats.totalProducts,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      bgColor: "bg-blue-500",
    },
    {
      title: 'Tổng kiểm tra',
      value: filteredStats.totalInspections,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
      bgColor: "bg-green-500",
    },
    {
      title: 'Kiểm tra thành công',
      value: filteredStats.successfulInspections,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
      bgColor: "bg-emerald-500",
    },
    {
      title: 'Phát hiện lỗi',
      value: filteredStats.errorInspections,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      bgColor: "bg-red-500",
    },
  ];

  const successRate = filteredStats.totalInspections > 0
    ? Math.round((filteredStats.successfulInspections / filteredStats.totalInspections) * 100)
    : 0;

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
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Chào mừng trở lại,{" "}
                <span className="text-primary-600">
                  {user?.displayName || "Saigonfood"}!
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
                      setDateRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    className="border-none outline-none bg-transparent"
                  />
                  <span className="text-gray-400">đến</span>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="border-none outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors duration-200 text-xs sm:text-sm ${filters.showFilters
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Filter className="w-4 h-4" />
                <span>Lọc</span>
                {(filters.productId || filters.tester) && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                )}
              </button>

              {/* Clear Filters Button */}
              {(filters.productId || filters.tester || dateRange.from !== '2024-01-16' || dateRange.to !== '2024-01-31') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {filters.showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product ID Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lọc theo sản phẩm (ID)
                  </label>
                  <select
                    value={filters.productId}
                    onChange={(e) => setFilters(prev => ({ ...prev, productId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    <option value="">Tất cả sản phẩm</option>
                    {mockProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} (ID: {product.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tester Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lọc theo người kiểm tra
                  </label>
                  <select
                    value={filters.tester}
                    onChange={(e) => setFilters(prev => ({ ...prev, tester: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    <option value="">Tất cả người kiểm tra</option>
                    {availableTesters.map(tester => (
                      <option key={tester} value={tester}>
                        {tester}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Summary */}
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">Kết quả lọc:</span> {filteredInspections.length} kiểm tra
                {filters.productId && (
                  <span>, Sản phẩm: {mockProducts.find(p => p.id === filters.productId)?.name}</span>
                )}
                {filters.tester && (
                  <span>, Người kiểm tra: {filters.tester}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="mobile-stats-grid mb-6 sm:mb-8">
          {stats.map((stat, index) => (
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
                  {filteredInspections.length > 0 ? '+5.2%' : 'N/A'}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 ml-1 hidden sm:inline">so với tuần trước</span>
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
                    strokeDasharray={`${successRate}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {successRate}%
                    </div>
                    <div className="text-xs text-gray-500">Thành công</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-base sm:text-lg font-semibold text-green-600">{filteredStats.successfulInspections}</div>
                <div className="text-xs sm:text-sm text-gray-500">Đạt yêu cầu</div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-semibold text-red-600">{filteredStats.errorInspections}</div>
                <div className="text-xs sm:text-sm text-gray-500">Có lỗi</div>
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

            {highErrorProducts.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {highErrorProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${product.color}`}></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{product.name}</span>
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
                <p className="text-sm text-gray-500">Không có sản phẩm lỗi trong khoảng thời gian này</p>
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
                    Cần kiểm tra lại quy trình in ấn cho các sản phẩm có tỷ lệ
                    lỗi cao
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                  <div className="text-xs sm:text-sm text-gray-500 w-10 sm:w-12 flex-shrink-0">{activity.time}</div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm font-medium text-gray-900 block">{activity.action}</span>
                    <span className="text-xs sm:text-sm text-gray-500 truncate block">{activity.product}</span>
                    {activity.tester && (
                      <span className="text-xs text-gray-400">bởi {activity.tester}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Không có hoạt động trong khoảng thời gian này</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
