export interface ApiResponse<T> {
    createdDate: string;
    data: T;
    message: string;
    path: string;
  }
  