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
  district_id: number;
  district: string;
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

type ListResult<K extends string, DataType> = { [key in K]: Array<DataType> };

export type GetListResult<K extends string, DataType> = {
  success: boolean;
  message?: string;
  data: { totalPages: number } & ListResult<K, DataType>;
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
  district_id: number;
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
