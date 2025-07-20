import "axios";

declare module "axios" {
  export interface AxiosResult<T = any> {
    status: "success" | "error";
    data: T;
    message: string;
  }
}
