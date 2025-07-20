import React, { useState } from "react";
import {
  Calendar,
  Package,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Filter,
  Menu,
} from "lucide-react";
import { UserFirebase } from "../types";
import { mockStats } from "../data/mockData";

interface HomeScreenProps {
  user: UserFirebase | null;
  onToggleSidebar: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, onToggleSidebar }) => {
  const [dateRange, setDateRange] = useState({
    from: "2024-01-01",
    to: "2024-02-01",
  });

  const stats = [
    {
      title: "Tổng sản phẩm",
      value: mockStats.totalProducts,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      bgColor: "bg-blue-500",
    },
    {
      title: "Tổng kiểm tra",
      value: mockStats.totalInspections,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
      bgColor: "bg-green-500",
    },
    {
      title: "Kiểm tra thành công",
      value: mockStats.successfulInspections,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
      bgColor: "bg-emerald-500",
    },
    {
      title: "Phát hiện lỗi",
      value: mockStats.errorInspections,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      bgColor: "bg-red-500",
    },
  ];

  const highErrorProducts = [
    { name: "Mì Gói Tôm Chua Cay", errors: 15, color: "bg-red-400" },
    { name: "Cháo Tôm Thịt", errors: 12, color: "bg-orange-400" },
    { name: "Tôm Khô Cao Cấp", errors: 8, color: "bg-yellow-400" },
    { name: "Mực Khô Cắt Lát", errors: 5, color: "bg-blue-400" },
  ];

  const successRate = Math.round(
    (mockStats.successfulInspections / mockStats.totalInspections) * 100
  );

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

            <div className="flex items-center space-x-2 sm:space-x-4">
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
            </div>
          </div>
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
                  +5.2%
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
                <div className="text-base sm:text-lg font-semibold text-green-600">
                  {mockStats.successfulInspections}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Đạt yêu cầu
                </div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-semibold text-red-600">
                  {mockStats.errorInspections}
                </div>
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

            <div className="space-y-3 sm:space-y-4">
              {highErrorProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${product.color}`}
                    ></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-red-600">
                    {product.errors} lỗi
                  </div>
                </div>
              ))}
            </div>

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
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Hoạt động gần đây
          </h3>
          <div className="space-y-3">
            {[
              {
                time: "10:30",
                action: "Kiểm tra thành công",
                product: "Cháo Tôm Thịt 240g",
                status: "success",
              },
              {
                time: "09:15",
                action: "Phát hiện lỗi",
                product: "Mì Gói Tôm Chua Cay",
                status: "error",
              },
              {
                time: "08:45",
                action: "Kiểm tra thành công",
                product: "Tôm Khô Cao Cấp",
                status: "success",
              },
            ].map((activity, index) => (
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
                    {activity.product}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
