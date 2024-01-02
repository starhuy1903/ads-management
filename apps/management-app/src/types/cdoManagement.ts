export type MessageResponse = {
  statusCode?: number;
  message?: string;
};

export type District = {
  id: number;
  name: string;
};

export type Ward = {
  id: number;
  name: string;
  districtId: number;
};

export type PanelType = {
  id: number;
  name: string;
};

export type ReportType = {
  id: number;
  name: string;
};

export type AdsType = {
  id: number;
  name: string;
};

export type LocationType = {
  id: number;
  name: string;
};

// type ListResult<K extends string, DataType> = { [key in K]: Array<DataType> };

// export type GetListResult<K extends string, DataType> = {
//   success: boolean;
//   message?: string;
//   data: { totalPages: number } & ListResult<K, DataType>;
// };

export type GetListResult<DataType> = {
  data: Array<DataType>;
  totalPages: number;
  totalCount: number;
};

export type GetDataResult<DataType> = {
  success: boolean;
  message?: string;
  data: DataType;
};

export type DistrictDto = {
  name: string;
};

export type WardDto = {
  name: string;
  districtId: number;
};

export type PanelTypeDto = {
  name: string;
};

export type ReportTypeDto = {
  name: string;
};

export type LocationTypeDto = {
  name: string;
};

export type AdsTypeDto = {
  name: string;
};

export type GetStatictisQueryOptions = {
  dateValue: string;
  dateType: 'MONTH' | 'YEAR';
  wards: Array<number>;
  districts: Array<number>;
};

export type GetStatictisResult = {
  success: boolean;
  message?: string;
  data: {
    resolved: Array<number>;
    unresolved: Array<number>;
  };
};
export interface IStatisticsViewOptions {
  mode: 'YEAR' | 'MONTH';
  wards: Array<number>;
  districts: Array<number>;
  year: number;
  month: number;
}
