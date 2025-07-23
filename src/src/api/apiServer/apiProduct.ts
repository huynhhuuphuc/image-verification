import request from "../apiConfig";

export const getListAllProducts = async (
  params: Api.ProductParams
): Promise<Api.ProductResponse> => {
  const response = await request({
    url: "/products",
    method: "GET",
    params,
  });
  return response.data;
};

export const createProduct = async (
  product: Api.ProductCreateProps
): Promise<Api.ProductProps> => {
  const response = await request({
    url: "/products",
    method: "POST",
    data: product,
  });
  return response.data;
};

export const getProductByProductCode = async (
  productCode: string
): Promise<Api.ProductProps> => {
  const response = await request({
    url: `/products/${productCode}`,
    method: "GET",
  });
  return response.data;
};

export const updateProduct = async (
  product: Api.ProductUpdateProps,
  productCode: string
): Promise<Api.ProductProps> => {
  const response = await request({
    url: `/products/${productCode}`,
    method: "PUT",
    data: product,
  });
  return response.data;
};

export const deleteProduct = async (productCode: string): Promise<void> => {
  await request({
    url: `/products/${productCode}`,
    method: "DELETE",
  });
};
