import request from "../apiConfig";

const uploadFile = async (
  file: File,
  upload_type: string
): Promise<Api.UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_type", upload_type);
  const response = await request({
    url: "/upload",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export { uploadFile };
