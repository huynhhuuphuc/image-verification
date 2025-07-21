import { toast } from "react-hot-toast";

export const useToastQueue = () => {
  const showToastAndWait = (message: string, type: "success" | "error") => {
    return new Promise<void>((resolve) => {
      const toastId = toast[type](message, {
        duration: 500,
      });

      setTimeout(() => {
        toast.dismiss(toastId);
        resolve();
      }, 500);
    });
  };

  return { showToastAndWait };
};
