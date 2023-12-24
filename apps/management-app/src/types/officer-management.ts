export type GetListResult<T> = {
  data: {
    locations?: Array<T>;
    panels?: Array<T>;
    totalPages?: number;
  };
};

export type GetDetailResult<T> = {
  data?: T;
};

export type Location = {
  id: number;
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
  type?: {
    id: number;
    name: string;
  };
  ad_type?: {
    id: number;
    name: string;
  };
  image_urls: string[];
  isPlanning: boolean;
  created_time: string;
  modified_time: string;
};

export type Panel = {
  id: number;
  width: string;
  height: string;
  image_urls: string[];
  company_email: string;
  company_number: string;
  status: string;
  type: {
    id: number;
    name: string;
  };
  location: Location;
  create_contract_date: string;
  expired_contract_date: string;
  created_time: string;
  modified_time: string;
};

export type Report = {
  id: number;
  fullname: string;
  email: string;
  content: string;
  image_url: string[];
  report_type: {
    id: number;
    name: string;
  };
  status: string;
  resolved_content: string;
  location?: Location;
  panel?: Panel;
  createdAt: string;
  updatedAt: string;
};
