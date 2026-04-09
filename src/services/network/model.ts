export interface BaseModel<T> {
  error: string;
  errorDescription: string;
  response: T[];
}

export interface BaseListModel<T> {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  currentPage: number;
}


export interface BaseError {
  code: number;
  error: string;
  errorDescription: string;
}

export interface BaseParamsModel {
  page: number;
  size: number;
  search?: string;
}