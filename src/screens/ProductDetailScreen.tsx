import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Camera,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  FileImage,
  Zap,
  Eye,
  Menu
} from 'lucide-react';
import { mockProducts, mockInspections } from '../data/mockData';

interface ProductDetailScreenProps {
  onToggleSidebar: () => void;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ onToggleSidebar }) => {
  const { id } = useParams<{ id: string }>();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const product = mockProducts.find(p => p.id === id);
  const inspections = mockInspections.filter(i => i.productId === id);

  if (!product) {
    return (
      <div className="mobile-container py-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="btn-primary">Quay lại danh sách</Link>
      </div>
    );
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        simulateAIAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        status: Math.random() > 0.3 ? 'Passed' : 'Error',
        confidence: 95.8,
        analysis: Math.random() > 0.3
          ? 'Nhãn mác khớp hoàn toàn với mẫu thiết kế. Không phát hiện lỗi.'
          : 'Phát hiện lỗi: Thiếu ký tự trong từ "Protein" (hiển thị "Protei"). Màu sắc logo hơi mờ so với mẫu chuẩn.',
        differences: Math.random() > 0.3 ? [] : [
          'Thiếu ký tự "n" trong từ "Protein"',
          'Logo mờ hơn 15% so với mẫu chuẩn',
          'QR code hơi nghiêng 2°'
        ]
      });
    }, 3000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full min-h-full">
      <div className="mobile-container py-4 sm:py-6 max-w-7xl mx-auto pb-8">
        {/* Mobile Header with Hamburger and Back */}
        <div className="flex items-center justify-between mb-6 sm:hidden">
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
          <h1 className="text-lg font-bold text-gray-900 truncate">{product.name}</h1>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="hidden sm:flex items-center space-x-4 mb-4">
            <Link
              to="/products"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 text-sm sm:text-base">Chi tiết sản phẩm và kiểm tra AI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Left Column - Image Upload & Analysis */}
          <div className="space-y-4 sm:space-y-6">
            {/* Standard Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Ảnh mẫu chuẩn</h3>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={`${product.name} - Mẫu chuẩn`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Ảnh cần so sánh</h3>

              {!uploadedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-gray-400 transition-colors duration-200">
                  <div className="space-y-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm sm:text-base">Tải lên ảnh thực tế</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Kéo thả file hoặc click để chọn
                      </p>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <label className="btn-primary cursor-pointer text-sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Chọn ảnh
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={uploadedImage}
                      alt="Ảnh kiểm tra"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setAnalysisResult(null);
                    }}
                    className="btn-secondary w-full"
                  >
                    Thay đổi ảnh
                  </button>
                </div>
              )}
            </div>

            {/* AI Analysis Result */}
            {(isAnalyzing || analysisResult) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Kết quả phân tích AI</h3>

                {isAnalyzing ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2 text-sm sm:text-base">Đang phân tích...</p>
                    <p className="text-xs sm:text-sm text-gray-500">AI đang so sánh và kiểm tra hình ảnh</p>
                    <div className="mt-4 w-32 sm:w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                ) : analysisResult && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${analysisResult.status === 'Passed'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                      }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {analysisResult.status === 'Passed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`font-semibold text-sm sm:text-base ${analysisResult.status === 'Passed' ? 'text-green-800' : 'text-red-800'
                          }`}>
                          {analysisResult.status === 'Passed' ? 'Kiểm tra thành công' : 'Phát hiện lỗi'}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600">
                          ({analysisResult.confidence}% độ tin cậy)
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm ${analysisResult.status === 'Passed' ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {analysisResult.analysis}
                      </p>
                    </div>

                    {analysisResult.differences && analysisResult.differences.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">Chi tiết các khác biệt:</h4>
                        <ul className="space-y-1">
                          {analysisResult.differences.map((diff: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2 text-xs sm:text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{diff}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Inspection History & Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Lịch sử kiểm tra</h3>

              {inspections.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {inspections.map((inspection) => (
                    <div
                      key={inspection.id}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                          {inspection.status === 'Passed' ? (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                          )}
                          <span className={`font-medium text-sm sm:text-base ${inspection.status === 'Passed' ? 'text-green-800' : 'text-red-800'
                            }`}>
                            {inspection.status === 'Passed' ? 'Thành công' : 'Có lỗi'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{formatDate(inspection.timestamp)}</span>
                        </div>
                      </div>

                      {inspection.aiAnalysis && (
                        <p className="text-xs sm:text-sm text-gray-700 mb-2">
                          {inspection.aiAnalysis}
                        </p>
                      )}

                      {inspection.differences && inspection.differences.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Khác biệt phát hiện:</p>
                          <ul className="space-y-1">
                            {inspection.differences.map((diff, index) => (
                              <li key={index} className="text-xs text-red-600 flex items-start space-x-1">
                                <span>•</span>
                                <span>{diff}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button className="mt-2 text-xs text-primary-600 hover:text-primary-700 flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Xem chi tiết</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileImage className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1 text-sm sm:text-base">Chưa có lịch sử kiểm tra</p>
                  <p className="text-xs sm:text-sm text-gray-500">Tải lên ảnh để bắt đầu kiểm tra</p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Thông tin sản phẩm</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Tên sản phẩm:</span>
                  <span className="font-medium text-gray-900 text-xs sm:text-sm text-right">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Danh mục:</span>
                  <span className="font-medium text-gray-900 capitalize text-xs sm:text-sm">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Ngày tạo:</span>
                  <span className="font-medium text-gray-900 text-xs sm:text-sm">{formatDate(product.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Trạng thái:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Đang hoạt động
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen; 