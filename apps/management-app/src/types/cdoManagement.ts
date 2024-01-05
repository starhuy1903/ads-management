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
  wardIds?: Array<number>;
  districtIds?: Array<number>;
};

export type GetStatictisResult = {
  success: boolean;
  message?: string;
  data: {
    resolved: Array<number>;
    unresolved: Array<number>;
  };
};
export type IStatisticsViewOptions = {
  mode: 'YEAR' | 'MONTH';
  wardIds: Array<number>;
  districtIds: Array<number>;
  year: number;
  month: number;
};

export type Location = {
  id: number;
  lat: number;
  long: number;
  isPlanning: boolean;
  districtId: number;
  wardId: number;
  fullAddress: string;
  typeId: number;
  adTypeId: number;
  imageUrls: Array<string>;
  createdAt: string;
  updatedAt: string;
  name: string;
  status: 'APPROVED' | 'AWAITING_UPDATE';
  // panel: Array<Panel>;
  type: LocationType;
  adType: AdsType;
  district: District;
  ward: Ward;
  belongLocationId?: number;
};

export type LocationFull = Location & {
  panel: Array<Panel>;
};

export type Panel = {
  id: number;
  typeId: number;
  width: number;
  height: number;
  locationId: number;
  imageUrls: Array<string>;
  createContractDate: string;
  expiredContractDate: string;
  companyEmail: string;
  companyNumber: string;
  createdAt: string;
  updatedAt: string;
  status: 'DRAFT' | 'APPROVED' | 'AWAITING_UPDATE';
  type: PanelType;
  // location: Location;
  belongPanelId?: number;
};

export type PanelFull = Panel & {
  location: Location;
};

export type AdsRequest = {
  id: number;
  reason: string;
  status: string;
  targetType: 'Panel' | 'Location';
  locationId?: number;
  location?: Location;
  panelId?: number;
  panel?: PanelFull;
  userId: number;
  createdAt: string;
  updatedAt: string;
  type: 'UPDATE_DATA' | 'APPROVED_PANEL';
  user: User;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dob?: string;
  resetPassword: boolean;
  createdAt: string;
  updatedAt: string;
  wardId?: number;
  districtId?: number;
  role: 'ward_officer' | 'district_officer' | 'cdo';
};
