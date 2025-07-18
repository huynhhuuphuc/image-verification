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
  Menu,
  X,
  ZoomIn
} from 'lucide-react';
import { mockProducts, mockInspections } from '../data/mockData';
import PreviewModal from '../components/PreviewModal';

interface ProductDetailScreenProps {
  onToggleSidebar: () => void;
}

interface InspectionDetailModalProps {
  inspection: any;
  onClose: () => void;
}

const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({ inspection, onClose }) => {
  const [previewImage, setPreviewImage] = useState<{ url: string, alt: string } | null>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Chi tiết kiểm tra</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Inspection Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Thời gian kiểm tra:</span>
                <p className="font-medium text-gray-900">
                  {inspection.timestamp.toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Kết quả:</span>
                <div className="flex items-center space-x-2 mt-1">
                  {inspection.status === 'Passed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${inspection.status === 'Passed' ? 'text-green-800' : 'text-red-800'
                    }`}>
                    {inspection.status === 'Passed' ? 'Thành công' : 'Có lỗi'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Độ tin cậy:</span>
                <p className="font-medium text-gray-900">{inspection.confidence}%</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Người thực hiện:</span>
                <p className="font-medium text-gray-900">{inspection.inspector || 'Hệ thống AI'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">ID kiểm tra:</span>
                <p className="font-mono text-sm text-gray-600">{inspection.id}</p>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          {inspection.aiAnalysis && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Phân tích AI:</h3>
              <p className="text-sm text-gray-700">{inspection.aiAnalysis}</p>
            </div>
          )}

          {/* Differences */}
          {inspection.differences && inspection.differences.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Các khác biệt phát hiện:</h3>
              <div className="space-y-2">
                {inspection.differences.map((diff: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-800">{diff}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Comparison */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">So sánh hình ảnh:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Ảnh mẫu chuẩn:</p>
                <div className="relative group">
                  <img
                    src={inspection.standardImage || 'https://placehold.co/400x300'}
                    alt="Ảnh mẫu chuẩn"
                    className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:brightness-110 transition-all duration-200"
                    onClick={() => setPreviewImage({
                      url: inspection.standardImage || 'https://placehold.co/400x300',
                      alt: 'Ảnh mẫu chuẩn'
                    })}
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreviewImage({
                        url: inspection.standardImage || 'https://placehold.co/400x300',
                        alt: 'Ảnh mẫu chuẩn'
                      });
                    }}
                  >
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer" />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Ảnh kiểm tra:</p>
                <div className="relative group">
                  <img
                    src={inspection.testImageUrl || inspection.testImage || 'https://placehold.co/400x300'}
                    alt="Ảnh kiểm tra"
                    className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:brightness-110 transition-all duration-200"
                    onClick={() => setPreviewImage({
                      url: inspection.testImageUrl || inspection.testImage || 'https://placehold.co/400x300',
                      alt: 'Ảnh kiểm tra'
                    })}
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreviewImage({
                        url: inspection.testImageUrl || inspection.testImage || 'https://placehold.co/400x300',
                        alt: 'Ảnh kiểm tra'
                      });
                    }}
                  >
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <PreviewModal
          imageUrl={previewImage.url}
          imageAlt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
};

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ onToggleSidebar }) => {
  const { id } = useParams<{ id: string }>();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string, alt: string } | null>(null);

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
          <h1 className="text-lg font-bold text-gray-900 truncate">{product.name}</h1>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 text-sm sm:text-base">Chi tiết sản phẩm và kiểm tra AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Left Column - Product Images */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Three Images Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Hình ảnh sản phẩm</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Representative Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Ảnh đại diện</label>
                  <div className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={product.image}
                      alt={`${product.name} - Ảnh đại diện`}
                      className="w-full h-full object-cover cursor-pointer hover:brightness-110 transition-all duration-200"
                      onClick={() => setPreviewImage({
                        url: product.image,
                        alt: `${product.name} - Ảnh đại diện`
                      })}
                    />
                    <div
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPreviewImage({
                          url: product.image,
                          alt: product.name
                        });
                      }}
                    >
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Sample Design Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Ảnh mẫu thiết kế</label>
                  <div className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={product.sampleImage || product.image}
                      alt={`${product.name} - Mẫu thiết kế`}
                      className="w-full h-full object-cover cursor-pointer hover:brightness-110 transition-all duration-200"
                      onClick={() => setPreviewImage({
                        url: product.sampleImage || product.image,
                        alt: `${product.name} - Mẫu thiết kế`
                      })}
                    />
                    <div
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPreviewImage({
                          url: product.sampleImage || product.image,
                          alt: `${product.name} - Mẫu thiết kế`
                        });
                      }}
                    >
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Printed Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Ảnh in thực tế</label>
                  {!uploadedImage ? (
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors duration-200">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                        <Upload className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs font-medium text-gray-900 mb-1 text-center">Tải lên ảnh in</p>
                      <label className="btn-primary cursor-pointer text-xs px-3 py-2 flex items-center justify-center">
                        <Camera className="w-3 h-3 mr-1" />
                        Chọn ảnh
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                      <img
                        src={uploadedImage}
                        alt="Ảnh in thực tế"
                        className="w-full h-full object-cover cursor-pointer hover:brightness-110 transition-all duration-200"
                        onClick={() => setPreviewImage({
                          url: uploadedImage,
                          alt: 'Ảnh in thực tế'
                        })}
                      />
                      <div
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPreviewImage({
                            url: uploadedImage,
                            alt: 'Ảnh in thực tế'
                          });
                        }}
                      >
                        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImage(null);
                          setAnalysisResult(null);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
                      onClick={() => setSelectedInspection(inspection)}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Inspection Image */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={inspection.testImageUrl || inspection.testImage || 'https://placehold.co/100x100'}
                            alt="Ảnh kiểm tra"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {inspection.status === 'Passed' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`font-medium text-sm ${inspection.status === 'Passed' ? 'text-green-800' : 'text-red-800'
                              }`}>
                              {inspection.status === 'Passed' ? 'Thành công' : 'Có lỗi'}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(inspection.timestamp)}</span>
                          </div>

                          {inspection.aiAnalysis && (
                            <p className="text-xs text-gray-700 line-clamp-2">
                              {inspection.aiAnalysis}
                            </p>
                          )}

                          <div className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 mt-2">
                            <ZoomIn className="w-3 h-3" />
                            <span className="text-xs font-medium">Xem chi tiết</span>
                          </div>
                        </div>
                      </div>
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

      {/* Inspection Detail Modal */}
      {selectedInspection && (
        <InspectionDetailModal
          inspection={selectedInspection}
          onClose={() => setSelectedInspection(null)}
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <PreviewModal
          imageUrl={previewImage.url}
          imageAlt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
};

export default ProductDetailScreen; 