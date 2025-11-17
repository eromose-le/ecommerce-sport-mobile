import { AxiosRequestConfig } from "axios";

export const axiosBaseQuery = (config?: AxiosRequestConfig) => {
  return {
    ...config,
    params: {
      ...(config?.params ?? {}),
    },
  };
};
