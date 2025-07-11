import React from 'react';
import { Scan, CheckCircle, Shield, Zap } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Kiểm tra chính xác',
      description: 'AI phân tích và so sánh hình ảnh với độ chính xác cao'
    },
    {
      icon: Shield,
      title: 'Bảo mật tối ưu',
      description: 'Dữ liệu được mã hóa và bảo vệ tuyệt đối'
    },
    {
      icon: Zap,
      title: 'Xử lý nhanh chóng',
      description: 'Kết quả kiểm tra trong vòng vài giây'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col lg:flex-row">
      {/* Left side - Branding - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-8 xl:p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Scan className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl xl:text-3xl font-bold">Kiểm Định Hình Ảnh</h1>
                <p className="text-blue-100">Hệ thống AI kiểm tra nhãn mác</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl xl:text-2xl font-semibold mb-6">
              Tối ưu hóa quy trình kiểm tra chất lượng in ấn
            </h2>

            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="text-sm text-blue-100">
              "Hệ thống đã giúp chúng tôi giảm 80% thời gian kiểm tra và tăng độ chính xác lên 99.5%"
            </p>
            <p className="text-sm font-medium mt-2">- Saigonfood Quality Team</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-20 h-20 bg-purple-400/20 rounded-full blur-lg"></div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kiểm Định Hình Ảnh</h1>
                <p className="text-xs sm:text-sm text-gray-500">Hệ thống AI kiểm tra nhãn mác</p>
              </div>
            </div>

            {/* Mobile features preview */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-gray-800">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-slide-up">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Chào mừng trở lại
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Đăng nhập để tiếp tục sử dụng hệ thống
              </p>
            </div>

            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md group text-sm sm:text-base"
              style={{ minHeight: '48px' }}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="group-hover:text-gray-900 transition-colors duration-200">
                Đăng nhập với Google
              </span>
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Bằng cách đăng nhập, bạn đồng ý với{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                  Chính sách bảo mật
                </a>
              </p>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              Cần hỗ trợ?{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Liên hệ với chúng tôi
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen; 