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
