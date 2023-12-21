export type GetListResult<T> = {
  data: {
    locations?: Array<T>;
    totalPages?: number;
  };
};

export type GetDetailResult<T> = {
  data?: T;
};

export type Location = {
  id?: number;
  full_address: string;
  ward: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
  };
  lat: number;
  long: number;
  type: {
    id: number;
    name: string;
  };
  ad_type: {
    id: number;
    name: string;
  };
  image_urls: string[];
  isPlanning: boolean;
  created_time: string;
  modified_time: string;
};
