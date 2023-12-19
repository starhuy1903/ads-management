export interface GetListResult<T> {
  data: {
    locations?: Array<T>;
    totalPages?: number;
  };
}

export interface LocationDto {
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
}
