import request from "../apiConfig";

export const getDashboardData = async (): Promise<any> => {
  const response = await request({
    url: `/dashboard/overview`,
    method: "GET",
  });
  return response.data;
};
