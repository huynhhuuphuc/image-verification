import { useState, useEffect, useCallback } from "react";
import { apiProduct } from "../src/api/apiServer";
import { useToastQueue } from "../src/utils/showToast";

interface UseProductFormProps {
  productsPerPage?: number;
}

export const useProductForm = ({
  productsPerPage = 50,
}: UseProductFormProps = {}) => {
  const { showToastAndWait } = useToastQueue();
  const [products, setProducts] = useState<Api.ProductProps[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (
      category?: string,
      keyword?: string,
      page: number = 1,
      limit: number = productsPerPage
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const params: Api.ProductParams = {
          skip: (page - 1) * limit,
          limit,
        };

        if (category && category !== "All") {
          params.category = category;
        }

        if (keyword && keyword.trim()) {
          params.keyword = keyword.trim();
        }

        const response = await apiProduct.getListAllProducts(params);
        setProducts(response.products || []);
        setTotalProducts(response.total || 0);
        setCurrentPage(page);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setIsLoading(false);
      }
    },
    [productsPerPage]
  );

  const deleteProduct = useCallback(
    async (productCode: string) => {
      try {
        setIsDeleting(true);
        await apiProduct.deleteProduct(productCode);
        await showToastAndWait("Đã xóa sản phẩm thành công", "success");
        // Refresh the products list after deletion
        await fetchProducts();
        return { success: true };
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Lỗi khi xóa sản phẩm"
        );
        return {
          success: false,
          error: error instanceof Error ? error.message : "Lỗi không xác định",
        };
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchProducts]
  );

  const refreshProducts = useCallback(
    (category?: string, keyword?: string) => {
      fetchProducts(category, keyword, currentPage, productsPerPage);
    },
    [fetchProducts, currentPage, productsPerPage]
  );

  const stats = {
    total: products.length,
    totalFromAPI: totalProducts,
    showingAllProducts: products.length === totalProducts,
    categories: products.map((product) => product.category),
    categoriesCount: (() => {
      const categoryList = [
        "FOOD",
        "SNACK",
        "BEVERAGE",
        "FROZEN",
        "FRESH",
        "OTHER",
      ];
      return products.reduce((acc, product) => {
        const category = product.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, Object.fromEntries(categoryList.map((cat) => [cat, 0])) as Record<string, number>);
    })(),
  };

  return {
    products,
    totalProducts,
    currentPage,
    isLoading,
    isDeleting,
    error,
    fetchProducts,
    refreshProducts,
    deleteProduct,
    stats,
  };
};
