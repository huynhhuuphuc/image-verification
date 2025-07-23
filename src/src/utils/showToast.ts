import { toast } from "react-hot-toast";

export const useToastQueue = () => {
  const showToastAndWait = (message: string, type: "success" | "error") => {
    return new Promise<void>((resolve) => {
      const toastId = toast[type](message, {
        duration: 1000,
      });

      setTimeout(() => {
        toast.dismiss(toastId);
        resolve();
      }, 1000);
    });
  };

  return { showToastAndWait };
};
