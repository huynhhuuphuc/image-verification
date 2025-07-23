import { useState, useEffect, useCallback } from "react";
import { apiProduct } from "../src/api/apiServer";

interface UseProductFormProps {
  productsPerPage?: number;
}

export const useProductForm = ({
  productsPerPage = 50,
}: UseProductFormProps = {}) => {
  const [products, setProducts] = useState<Api.ProductProps[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (page: number = currentPage, limit: number = productsPerPage) => {
      try {
        setIsLoading(true);
        const response = await apiProduct.getListAllProducts({
          skip: (page - 1) * limit,
          limit,
        });
        setProducts(response.products || []);
        setTotalProducts(response.total || 0);
        setCurrentPage(page);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, productsPerPage]
  );

  const refreshProducts = () => {
    fetchProducts(currentPage, productsPerPage);
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
  };
};
