import request from "../apiConfig";

export const currentUser = async (): Promise<Api.UserProps> => {
  const response = await request({
    // url: "/me",
    method: "GET",
    baseURL: "https://saigonfoods-dev-952258726764.asia-southeast1.run.app/me",
  });
  return response.data;
};

export const getListAllUsers = async (
  params: Api.ListParams
): Promise<Api.ListUsersResponse> => {
  const response = await request({
    url: "/users",
    method: "GET",
    params,
  });
  return response.data;
};

export const createUserByEmail = async (user: Api.UserByEmailProps) => {
  const response = await request({
    url: "/users/email",
    method: "POST",
    data: user,
  });
  return response;
};

export const updateUser = async (
  user: Api.UserUpdateProps
): Promise<Api.UserProps> => {
  const response = await request({
    url: `/users/email/${user.email}`,
    method: "PUT",
    data: user,
  });
  return response.data;
};

export const removeUser = async (email: string) => {
  const response = await request({
    url: `/users/email/${email}`,
    method: "DELETE",
  });
  return response.data;
};
