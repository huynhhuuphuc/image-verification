import { useState } from "react";
import { X } from "lucide-react";
import { CheckCircle, AlertTriangle, ZoomIn } from "lucide-react";
import { isInspectionPassed } from "../src/utils/validation";
import PreviewModal from "./PreviewModal";

interface InspectionDetailModalProps {
  inspection: Api.InspectionProps;
  onClose: () => void;
}

const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({
  inspection,
  onClose,
}) => {
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Chi tiết kiểm tra
            </h2>
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
                <span className="text-sm text-gray-500">
                  Thời gian kiểm tra:
                </span>
                <p className="font-medium text-gray-900">
                  {new Date(inspection.created_at).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Kết quả:</span>
                <div className="flex items-center space-x-2 mt-1">
                  {isInspectionPassed(inspection.status) ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  <span
                    className={`font-medium ${
                      isInspectionPassed(inspection.status)
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {isInspectionPassed(inspection.status)
                      ? "Thành công"
                      : "Có lỗi"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Người thực hiện:</span>
                <p className="font-medium text-gray-900">
                  {inspection.inspector_email || "Hệ thống AI"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">ID kiểm tra:</span>
                <p className="font-mono text-sm text-gray-600">
                  {inspection.inspection_code}
                </p>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          {inspection.ai_conclusion && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Phân tích AI:</h3>
              <p className="text-sm text-gray-700">
                {inspection.ai_conclusion}
              </p>
            </div>
          )}

          {/* Images Comparison */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              So sánh hình ảnh:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Ảnh mẫu chuẩn:</p>
                <div className="relative group">
                  <img
                    src={
                      inspection.sample_image?.public_url ||
                      "https://placehold.co/400x300"
                    }
                    alt="Ảnh mẫu chuẩn"
                    className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:brightness-110 transition-all duration-200"
                    onClick={() =>
                      setPreviewImage({
                        url:
                          inspection.sample_image?.public_url ||
                          "https://placehold.co/400x300",
                        alt: "Ảnh mẫu chuẩn",
                      })
                    }
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreviewImage({
                        url:
                          inspection.sample_image?.public_url ||
                          "https://placehold.co/400x300",
                        alt: "Ảnh mẫu chuẩn",
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
                    src={
                      inspection.uploaded_image?.public_url ||
                      "https://placehold.co/400x300"
                    }
                    alt="Ảnh kiểm tra"
                    className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:brightness-110 transition-all duration-200"
                    onClick={() =>
                      setPreviewImage({
                        url:
                          inspection.uploaded_image?.public_url ||
                          "https://placehold.co/400x300",
                        alt: "Ảnh kiểm tra",
                      })
                    }
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreviewImage({
                        url:
                          inspection.uploaded_image?.public_url ||
                          "https://placehold.co/400x300",
                        alt: "Ảnh kiểm tra",
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

export default InspectionDetailModal;
