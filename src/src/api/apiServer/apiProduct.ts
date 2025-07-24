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

// api for inspections
export const getListAllInspections =
  async (): Promise<Api.InspectionResponse> => {
    const response = await request({
      url: "/inspections",
      method: "GET",
    });
    return response.data;
  };
// api for detail api response
export const getInspectionByInspectionCode = async (
  inspectionCode: string
): Promise<Api.InspectionProps> => {
  const response = await request({
    url: `/inspections/product/${inspectionCode}`,
    method: "GET",
  });
  return response.data;
};

// api for detail inspection (product detail)
export const getDetailInspection = async (
  productCode: string
): Promise<Api.InspectionProps> => {
  const response = await request({
    url: `/inspections/code/${productCode}`,
    method: "GET",
  });
  return response.data;
};

// compare image with ai
export const compareImageWithAi = async (
  product_code: string,
  file: File
): Promise<Api.InspectionUploadAIProps> => {
  const formData = new FormData();
  formData.append("product_code", product_code);
  formData.append("file", file);
  formData.append("status", "WAIT");
  const response = await request({
    url: `/inspections/upload-multiple`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
