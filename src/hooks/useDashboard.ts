import { useState, useEffect, useCallback, useMemo } from "react";
import { getDashboardData } from "../src/api/apiServer/apiDashboard";
import { getListAllInspections } from "../src/api/apiServer/apiProduct";
import { useToastQueue } from "../src/utils/showToast";
import { getFromDate, getToDate } from "../src/utils/getDateRange";

interface UseDashboardProps {
  initialDateRange?: {
    from: string;
    to: string;
  };
}

interface UseDashboardReturn {
  // Data
  dashboardData: Api.DashboardResponse | null;
  inspectionsData: Api.InspectionResponse | null;

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;

  // Error state
  error: string | null;

  // Filter states
  dateRange: {
    from: string;
    to: string;
  };
  productCodeFilter: string;
  inspectorEmailFilter: string;
  keywordFilter: string;

  // Actions
  fetchDashboardData: () => Promise<void>;
  refreshDashboard: () => void;
  setDateRange: (dateRange: { from: string; to: string }) => void;
  setProductCodeFilter: (productCode: string) => void;
  setInspectorEmailFilter: (inspectorEmail: string) => void;
  setKeywordFilter: (keyword: string) => void;
  clearFilters: () => void;

  // Computed values
  stats: {
    totalProducts: number;
    totalInspections: number;
    successfulInspections: number;
    errorInspections: number;
    successRate: number;
  };
  topFailedProducts: Array<{
    id: string;
    name: string;
    category: string;
    errors: number;
    color: string;
  }>;
  recentActivities: Array<{
    time: string;
    action: string;
    productCode: string;
    productName: string;
    status: "success" | "error";
    inspector: string;
    inspectionCode: string;
  }>;
  hasActiveFilters: boolean;
}

export const useDashboard = ({
  initialDateRange = {
    from: getFromDate(),
    to: getToDate(),
  },
}: UseDashboardProps = {}): UseDashboardReturn => {
  const { showToastAndWait } = useToastQueue();

  // State management
  const [dashboardData, setDashboardData] =
    useState<Api.DashboardResponse | null>(null);
  const [inspectionsData, setInspectionsData] =
    useState<Api.InspectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [productCodeFilter, setProductCodeFilter] = useState("");
  const [inspectorEmailFilter, setInspectorEmailFilter] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("");

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setError(null);

      const isRefresh = dashboardData !== null;
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const params: Api.DashboardParams = {
        start_date: dateRange.from,
        end_date: dateRange.to,
        product_code: productCodeFilter,
        keyword: keywordFilter,
        inspector_email: inspectorEmailFilter,
      };

      // Fetch both dashboard and inspections data in parallel
      const [dashboardResult, inspectionsResult] = await Promise.all([
        getDashboardData(params),
        getListAllInspections(),
      ]);

      setDashboardData(dashboardResult);
      setInspectionsData(inspectionsResult);

      if (isRefresh) {
        await showToastAndWait("Dữ liệu đã được cập nhật", "success");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      const errorMessage = "Không thể tải dữ liệu dashboard. Vui lòng thử lại.";
      setError(errorMessage);
      await showToastAndWait(errorMessage, "error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Refresh dashboard (manual refresh)
  const refreshDashboard = () => {
    fetchDashboardData();
  };

  // Clear all filters
  const clearFilters = useCallback(() => {
    setProductCodeFilter("");
    setInspectorEmailFilter("");
    setKeywordFilter("");
    setDateRange(initialDateRange);
  }, [initialDateRange]);

  // Computed values
  const stats = useMemo(() => {
    if (!dashboardData?.metrics) {
      return {
        totalProducts: 0,
        totalInspections: 0,
        successfulInspections: 0,
        errorInspections: 0,
        successRate: 0,
      };
    }

    const { metrics } = dashboardData;
    const successRate =
      metrics.total_inspections > 0
        ? Math.round((metrics.total_passed / metrics.total_inspections) * 100)
        : 0;

    return {
      totalProducts: metrics.total_products,
      totalInspections: metrics.total_inspections,
      successfulInspections: metrics.total_passed,
      errorInspections: metrics.total_failed,
      successRate,
    };
  }, [dashboardData]);

  const topFailedProducts = useMemo(() => {
    if (!dashboardData?.top_failed_products) {
      return [];
    }

    return dashboardData.top_failed_products
      .map((product) => ({
        id: product.product_code,
        name: product.name,
        category: product.category,
        errors: product.failed_count,
        color:
          product.failed_count > 3
            ? "bg-red-400"
            : product.failed_count > 2
            ? "bg-orange-400"
            : product.failed_count > 1
            ? "bg-yellow-400"
            : "bg-blue-400",
      }))
      .slice(0, 4);
  }, [dashboardData]);

  const recentActivities = useMemo(() => {
    if (!inspectionsData?.inspections) {
      return [];
    }

    // Filter inspections based on current date range and filters
    const filteredInspections = inspectionsData.inspections.filter(
      (inspection) => {
        const inspectionDate = new Date(inspection.created_at);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);

        const withinDateRange =
          inspectionDate >= fromDate && inspectionDate <= toDate;
        const matchesProductCode =
          !productCodeFilter ||
          inspection.product_code
            .toLowerCase()
            .includes(productCodeFilter.toLowerCase());
        const matchesInspectorEmail =
          !inspectorEmailFilter ||
          inspection.inspector_email
            .toLowerCase()
            .includes(inspectorEmailFilter.toLowerCase());

        return withinDateRange && matchesProductCode && matchesInspectorEmail;
      }
    );

    return filteredInspections
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5)
      .map((inspection) => {
        const createdAt = new Date(inspection.created_at);
        return {
          time: createdAt.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          action:
            inspection.status === "PASSED"
              ? "Kiểm tra thành công"
              : "Phát hiện lỗi",
          productCode: inspection.product_code,
          productName: `Sản phẩm ${inspection.product_code}`,
          status:
            inspection.status === "PASSED"
              ? "success"
              : ("error" as "success" | "error"),
          inspector: inspection.inspector_email,
          inspectionCode: inspection.inspection_code,
        };
      });
  }, [inspectionsData, dateRange, productCodeFilter, inspectorEmailFilter]);

  const hasActiveFilters = useMemo(() => {
    return (
      productCodeFilter !== "" ||
      inspectorEmailFilter !== "" ||
      keywordFilter !== "" ||
      dateRange.from !== initialDateRange.from ||
      dateRange.to !== initialDateRange.to
    );
  }, [
    productCodeFilter,
    inspectorEmailFilter,
    keywordFilter,
    dateRange,
    initialDateRange,
  ]);

  // Fetch data when filters change (with debouncing handled by parent component)
  useEffect(() => {
    fetchDashboardData();
  }, [
    dateRange.from,
    dateRange.to,
    productCodeFilter,
    inspectorEmailFilter,
    keywordFilter,
  ]);

  return {
    // Data
    dashboardData,
    inspectionsData,

    // Loading states
    isLoading,
    isRefreshing,

    // Error state
    error,

    // Filter states
    dateRange,
    productCodeFilter,
    inspectorEmailFilter,
    keywordFilter,

    // Actions
    fetchDashboardData,
    refreshDashboard,
    setDateRange,
    setProductCodeFilter,
    setInspectorEmailFilter,
    setKeywordFilter,
    clearFilters,

    // Computed values
    stats,
    topFailedProducts,
    recentActivities,
    hasActiveFilters,
  };
};
