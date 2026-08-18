export type ErrorDetail = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp: string;
};


export type ErrorView = Pick<ErrorDetail, 'title' | 'detail'>
