import React, { useState } from 'react';
import { Plus, Search, Filter, User, Shield, Mail, MoreVertical, Menu } from 'lucide-react';
import { mockEmployees } from '../data/mockData';
import { User as UserType } from '../types';

interface EmployeeManagementScreenProps {
  onToggleSidebar: () => void;
}

const EmployeeManagementScreen: React.FC<EmployeeManagementScreenProps> = ({ onToggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'Administrator' | 'Employee'>('All');

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || employee.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roleColors = {
    Administrator: 'bg-purple-100 text-purple-800',
    Employee: 'bg-blue-100 text-blue-800'
  };

  const roleIcons = {
    Administrator: Shield,
    Employee: User
  };

  const getRoleStats = () => {
    return {
      total: mockEmployees.length,
      administrators: mockEmployees.filter(emp => emp.role === 'Administrator').length,
      employees: mockEmployees.filter(emp => emp.role === 'Employee').length
    };
  };

  const stats = getRoleStats();

  return (
    <div className="w-full min-h-full">
      <div className="mobile-container py-4 sm:py-6 max-w-7xl mx-auto pb-8">
        {/* Mobile Header with Hamburger */}
        <div className="flex items-center justify-between mb-6 sm:hidden">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Nhân viên</h1>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Quản lý nhân viên</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Theo dõi, phân quyền và quản lý danh sách nhân viên sử dụng hệ thống
              </p>
            </div>

            <button className="btn-primary flex items-center space-x-2 animate-bounce-in w-full sm:w-auto justify-center">
              <Plus className="w-5 h-5" />
              <span>Thêm nhân viên</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
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
            {(['All', 'Administrator', 'Employee'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${selectedRole === role
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {role === 'All' ? 'Tất cả' : role === 'Administrator' ? 'Quản trị viên' : 'Nhân viên'}
                {role === 'All' && ` (${stats.total})`}
                {role === 'Administrator' && ` (${stats.administrators})`}
                {role === 'Employee' && ` (${stats.employees})`}
              </button>
            ))}
          </div>
        </div>

        {/* Employee Grid */}
        <div className="mobile-grid mb-6 sm:mb-8">
          {filteredEmployees.map((employee, index) => {
            const RoleIcon = roleIcons[employee.role];
            return (
              <div
                key={employee.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{employee.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{employee.email}</p>
                    </div>
                  </div>

                  <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <RoleIcon className="w-4 h-4 text-gray-500" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[employee.role]}`}>
                      {employee.role === 'Administrator' ? 'Quản trị viên' : 'Nhân viên'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Hoạt động</span>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Công ty:</span>
                    <span className="font-medium text-gray-900 truncate ml-2">{employee.company}</span>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button className="flex-1 btn-secondary text-xs sm:text-sm py-2 flex items-center justify-center">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Liên hệ
                  </button>
                  <button className="flex-1 btn-primary text-xs sm:text-sm py-2">
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy nhân viên
            </h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc vai trò
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('All');
              }}
              className="btn-secondary"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Tổng nhân viên</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
                <p className="text-blue-100 text-xs mt-1">Đang hoạt động</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Quản trị viên</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.administrators}</p>
                <p className="text-purple-100 text-xs mt-1">Toàn quyền</p>
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
                <p className="text-xl sm:text-2xl font-bold">{stats.employees}</p>
                <p className="text-green-100 text-xs mt-1">Quyền hạn chế</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 gap-4">
            <button className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">Thêm nhân viên mới</p>
                <p className="text-xs sm:text-sm text-gray-500">Mời người dùng tham gia hệ thống</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">Quản lý quyền hạn</p>
                <p className="text-xs sm:text-sm text-gray-500">Phân quyền cho người dùng</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">Gửi thông báo</p>
                <p className="text-xs sm:text-sm text-gray-500">Thông báo đến tất cả nhân viên</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagementScreen; 