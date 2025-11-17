export type ServerResponse<T> = Partial<{
  message: string;
  data: T;
  success: boolean;
}>;

export type PaginatedServerResponse<T> = Partial<{
  message: string;
  data: {
    currentPage: number;
    pageCount: number;
    count: number;
    results: T[];
  };
  success: boolean;
}>;
