import React, { useState, useEffect } from "react";
import { CATEGORY_LABELS } from "../data/mockData";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Camera,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileImage,
  Zap,
  Menu,
  X,
  ZoomIn,
  Download,
  Loader2,
} from "lucide-react";
import PreviewModal from "../components/PreviewModal";
import {
  getProductByProductCode,
  getInspectionByInspectionCode,
  getDetailInspection,
  compareImageWithAi,
} from "../src/api/apiServer/apiProduct";
import { isInspectionPassed } from "../src/utils/validation";
import InspectionDetailModal from "../components/InspectionDetailModal";

interface ProductDetailScreenProps {
  onToggleSidebar: () => void;
}

interface UploadedImage {
  id: string;
  file: string;
  name: string;
  uploadTime: Date;
  isUploading: boolean;
  uploadStatus: "success" | "failed" | "pending";
  uploadMessage?: string;
  originalFile: File;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  onToggleSidebar,
}) => {
  const { productCode } = useParams();
  console.log("productCode", productCode);
  const [product, setProduct] = useState<Api.ProductProps | null>(null);
  const [inspectionsCode, setInspectionsCode] = useState<Api.InspectionProps[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedInspection, setSelectedInspection] =
    useState<Api.InspectionProps | null>(null);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!productCode) {
        console.log("No product ID provided");
        return;
      }

      console.log("Fetching data for product ID:", productCode);

      try {
        setLoading(true);
        setError(null);

        // Fetch product details by product code
        console.log("Calling getProductByProductCode with ID:", productCode);
        const productData = await getProductByProductCode(productCode);
        console.log("Product data received:", productData);
        setProduct(productData);

        // Fetch inspection history for this product
        console.log(
          "Calling getInspectionByInspectionCode for product:",
          productCode
        );
        try {
          const inspectionData = (await getInspectionByInspectionCode(
            productCode
          )) as any;
          console.log("Inspection history received:", inspectionData);

          // Handle API response format - extract inspections array from response
          if (
            inspectionData &&
            inspectionData.inspections &&
            Array.isArray(inspectionData.inspections)
          ) {
            console.log(
              "Processed inspection history for product:",
              inspectionData.inspections
            );
            setInspectionsCode(inspectionData.inspections);
          } else {
            console.log("No inspection history found for product");
            setInspectionsCode([]);
          }
        } catch (inspectionError) {
          console.log(
            "No inspection history found for this product or API error:",
            inspectionError
          );
          setInspectionsCode([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          `Không thể tải dữ liệu sản phẩm: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productCode]);

  if (loading) {
    return (
      <div className="mobile-container py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mobile-container py-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          {error || "Không tìm thấy sản phẩm"}
        </h2>
        <Link to="/products" className="btn-primary">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !productCode) return;

    const filesArray = Array.from(files);

    // Create UI entries for each file with preview
    const imagePromises = filesArray.map((file) => {
      return new Promise<UploadedImage>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: UploadedImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file: e.target?.result as string,
            name: file.name,
            uploadTime: new Date(),
            isUploading: true,
            uploadStatus: "pending",
            originalFile: file,
          };
          resolve(newImage);
        };
        reader.readAsDataURL(file);
      });
    });

    // Wait for all images to be processed and add to state
    const processedImages = await Promise.all(imagePromises);
    setUploadedImages((prev) => [...prev, ...processedImages]);

    // Call API with all files at once
    try {
      const apiResponse = await compareImageWithAi(productCode, filesArray);
      console.log("Upload response:", apiResponse);

      setUploadedImages((prev) =>
        prev.map((img) => {
          const wasUploaded = apiResponse.uploaded_files?.some(
            (uploaded) => uploaded.filename === img.name
          );

          const wasFailed = apiResponse.failed_files?.some(
            (failed: any) => failed.filename === img.name
          );

          return {
            ...img,
            isUploading: false,
            uploadStatus: wasUploaded
              ? "success"
              : wasFailed
              ? "failed"
              : "failed",
            uploadMessage: wasUploaded ? "Upload successful" : "Upload failed",
          };
        })
      );

      // If any files were uploaded successfully, refresh the inspection history
      if (apiResponse.total_uploaded > 0) {
        console.log("Refreshing inspection history...");
        try {
          const inspectionData = (await getInspectionByInspectionCode(
            productCode
          )) as any;

          if (
            inspectionData &&
            inspectionData.inspections &&
            Array.isArray(inspectionData.inspections)
          ) {
            setInspectionsCode(inspectionData.inspections);
            console.log(
              "Inspection history refreshed:",
              inspectionData.inspections
            );
          }
        } catch (refreshError) {
          console.log("Could not refresh inspection history:", refreshError);
        }
      }
    } catch (error) {
      console.error("Error in upload:", error);
      setUploadedImages((prev) =>
        prev.map((img) => ({
          ...img,
          isUploading: false,
          uploadStatus: "failed" as const,
          uploadMessage: "Upload failed",
        }))
      );
    }
  };

  const removeUploadedImage = (imageId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleInspectionClick = async (inspectionCode: string) => {
    try {
      console.log("Fetching detailed inspection for code:", inspectionCode);
      const detailedInspection = await getDetailInspection(inspectionCode);
      console.log("Detailed inspection received:", detailedInspection);
      setSelectedInspection(detailedInspection);
    } catch (error) {
      console.error("Error fetching inspection details:", error);
    }
  };

  const exportToExcel = () => {
    // Combine existing inspectionsCode and new uploaded images with results
    const uploadedResults = uploadedImages
      .filter((img) => img.uploadStatus === "success")
      .map((img) => ({
        "Product ID": product?.product_code || "",
        "Product Name": product?.name || "",
        "Test Time": img.uploadTime.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        "Test Conclusion": img.uploadMessage || "Uploaded successfully",
        "Test Status": "Đã tải lên",
        Tester: "Hệ thống AI",
        Confidence: "95%",
        Source: "Mới tải lên",
      }));

    const existingInspections = inspectionsCode.map((inspection, index) => ({
      "Product ID": product?.product_code || "",
      "Product Name": product?.name || "",
      "Test Time": new Date(inspection.created_at).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      "Test Conclusion": inspection.ai_conclusion || "",
      "Test Status": isInspectionPassed(inspection.status)
        ? "Thành công"
        : "Có lỗi",
      Tester: inspection.inspector_email || "Hệ thống AI",
      Confidence: "95%",
      Source: "Lịch sử",
    }));

    const excelData = [...uploadedResults, ...existingInspections];

    const csvContent = [
      // Headers
      [
        "Product ID",
        "Product Name",
        "Test Time",
        "Test Conclusion",
        "Test Status",
        "Tester",
        "Confidence",
        "Source",
      ],
      // Data rows
      ...excelData.map((row) => [
        row["Product ID"],
        row["Product Name"],
        row["Test Time"],
        row["Test Conclusion"],
        row["Test Status"],
        row["Tester"],
        row["Confidence"],
        row["Source"],
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Create and download file
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `test-history-${product?.name || "product"}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
          <h1 className="text-lg font-bold text-gray-900 truncate">
            {product.name}
          </h1>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Chi tiết sản phẩm và kiểm tra AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Left Column - Product Images */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Three Images Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Hình ảnh sản phẩm
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Representative Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ảnh đại diện
                  </label>
                  <div className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={
                        product.avatar?.public_url ||
                        "https://placehold.co/400x400"
                      }
                      alt={`${product.name} - Ảnh đại diện`}
                      className="w-full h-full object-cover cursor-pointer hover:brightness-110 transition-all duration-200"
                      onClick={() =>
                        setPreviewImage({
                          url:
                            product.avatar?.public_url ||
                            "https://placehold.co/400x400",
                          alt: `${product.name} - Ảnh đại diện`,
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
                            product.avatar?.public_url ||
                            "https://placehold.co/400x400",
                          alt: product.name,
                        });
                      }}
                    >
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Sample Design Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ảnh mẫu thiết kế
                  </label>
                  <div className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={
                        product.sample_image?.public_url ||
                        "https://placehold.co/400x400"
                      }
                      alt={`${product.name} - Mẫu thiết kế`}
                      className="w-full h-full object-cover cursor-pointer hover:brightness-110 transition-all duration-200"
                      onClick={() =>
                        setPreviewImage({
                          url:
                            product.sample_image?.public_url ||
                            "https://placehold.co/400x400",
                          alt: `${product.name} - Mẫu thiết kế`,
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
                            product.sample_image?.public_url ||
                            "https://placehold.co/400x400",
                          alt: `${product.name} - Mẫu thiết kế`,
                        });
                      }}
                    >
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Multiple Images Upload */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tải lên ảnh in thực tế (nhiều ảnh)
                  </label>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Tải lên ảnh in thực tế
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Chọn nhiều ảnh cùng lúc (PNG, JPG)
                    </p>
                    <label className="btn-primary cursor-pointer text-sm flex items-center justify-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Chọn ảnh
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Uploaded Images Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                            <img
                              src={image.file}
                              alt={image.name}
                              className="w-full h-full object-cover cursor-pointer hover:brightness-110 transition-all duration-200"
                              onClick={() =>
                                setPreviewImage({
                                  url: image.file,
                                  alt: image.name,
                                })
                              }
                            />
                            <div
                              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPreviewImage({
                                  url: image.file,
                                  alt: image.name,
                                });
                              }}
                            >
                              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer" />
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeUploadedImage(image.id);
                              }}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 z-10"
                            >
                              <X className="w-3 h-3" />
                            </button>

                            {image.uploadStatus === "success" && (
                              <div className="absolute bottom-2 left-2 right-2">
                                <div
                                  className={`text-white text-xs px-2 py-1 rounded flex items-center ${
                                    image.uploadStatus === "success"
                                      ? "bg-green-600"
                                      : "bg-red-600"
                                  }`}
                                >
                                  {image.uploadStatus === "success" ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                  )}
                                  {image.uploadStatus === "success"
                                    ? "Thành công"
                                    : "Có lỗi"}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Image Info */}
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 truncate">
                              {image.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {image.uploadTime.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Inspection History & Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Lịch sử kiểm tra
                </h3>
                {inspectionsCode.length > 0 && (
                  <button
                    onClick={exportToExcel}
                    className="btn-secondary text-xs sm:text-sm py-2 px-3 flex items-center space-x-2"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Xuất Excel</span>
                  </button>
                )}
              </div>

              {inspectionsCode.length > 0 ||
              uploadedImages.some((img) => img.uploadStatus === "success") ? (
                <div className="space-y-3 sm:space-y-4 h-[530px] overflow-y-auto pr-2">
                  {/* Existing Inspection History */}
                  {inspectionsCode.map((inspection) => (
                    <div
                      key={inspection.inspection_code}
                      onClick={() =>
                        handleInspectionClick(inspection.inspection_code)
                      }
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Inspection Image */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={
                              inspection.uploaded_image?.public_url ||
                              "https://placehold.co/100x100"
                            }
                            alt="Ảnh kiểm tra"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {isInspectionPassed(inspection.status) ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            )}
                            <span
                              className={`font-medium text-sm ${
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

                          <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(inspection.created_at)}</span>
                          </div>

                          {inspection.ai_conclusion && (
                            <p className="text-xs text-gray-700 line-clamp-2">
                              {inspection.ai_conclusion}
                            </p>
                          )}

                          <div className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 mt-2">
                            <ZoomIn className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              Xem chi tiết
                            </span>
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
                  <p className="text-gray-900 font-medium mb-1 text-sm sm:text-base">
                    Chưa có lịch sử kiểm tra
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Tải lên ảnh để bắt đầu kiểm tra
                  </p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Thông tin sản phẩm
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">
                    Tên sản phẩm:
                  </span>
                  <span className="font-medium text-gray-900 text-xs sm:text-sm text-right">
                    {product.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">
                    Danh mục:
                  </span>
                  <span className="font-medium text-gray-900 capitalize text-xs sm:text-sm">
                    {
                      CATEGORY_LABELS[
                        product.category as keyof typeof CATEGORY_LABELS
                      ]
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">
                    Ngày tạo:
                  </span>
                  <span className="font-medium text-gray-900 text-xs sm:text-sm">
                    {formatDate(product.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">
                    Trạng thái:
                  </span>
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
