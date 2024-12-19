export type BaseResponse = {
  status?: number;
  message?: string;
};
export type ApiResponse<T = unknown> = BaseResponse & {
  data?: T;
};
