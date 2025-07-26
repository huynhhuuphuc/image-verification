import request from "../apiConfig";

export const getDashboardData = async (
  params: Api.DashboardParams
): Promise<Api.DashboardResponse> => {
  const response = await request({
    url: `/dashboard/overview?start_date=${params.start_date}&end_date=${params.end_date}&product_code=${params.product_code}&keyword=${params.keyword}&inspector_email=${params.inspector_email}`,
    method: "GET",
  });
  return response.data;
};
