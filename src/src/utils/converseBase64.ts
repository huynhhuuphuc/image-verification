export const getFile = async (
  base64: any,
  fileName?: string
): Promise<File> => {
  const img = new Image();
  img.src = base64;

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0);

  const jpegBase64 = canvas.toDataURL("image/jpeg", 0.9);

  const base64WithoutHeader = jpegBase64.split(",")[1];
  const byteCharacters = atob(base64WithoutHeader);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: "image/jpeg" });
  const file = new File([blob], `${fileName}.jpg`, {
    lastModified: new Date().getTime(),
    type: "image/jpeg",
  });

  return file;
};
