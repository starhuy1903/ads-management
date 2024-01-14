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

export enum LocationStatus {
  APPROVED = 'APPROVED',
  AWAITING_UPDATE = 'AWAITING_UPDATE',
}

export enum PanelStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  AWAITING_UPDATE = 'AWAITING_UPDATE',
}

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
  status: LocationStatus;
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
  status: PanelStatus;
  type: PanelType;
  // location: Location;
  belongPanelId?: number;
};

export type PanelFull = Panel & {
  location: Location;
};

export enum AdsRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export type AdsRequest = {
  id: number;
  reason: string;
  status: AdsRequestStatus;
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

export type AdsRequestQueryOptions = {
  take: number;
  page: number;
  type: 'UPDATE_DATA' | 'APPROVED_PANEL';
  wards?: Array<number>;
  districts?: Array<number>;
  status?: AdsRequestStatus;
  targetType?: 'Panel' | 'Location';
};

export type IAdsRequestViewOptions = {
  take?: number;
  page?: number;
  wards: Array<number>;
  districts: Array<number>;
  status?: AdsRequestStatus;
  targetType?: 'Panel' | 'Location';
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

export type LocationDto = {
  name: string;
  lat: number;
  long: number;
  isPlanning: boolean;
  districtId: number;
  wardId: number;
  fullAddress: string;
  typeId: number;
  adsTypeId: number;
  images?: Array<File>;
  imageUrls?: Array<string>;
  status: LocationStatus;
};

export type PanelDto = {
  typeId: number;
  width: number;
  height: number;
  locationId: number;
  images?: Array<File>;
  createContractDate: string;
  expiredContractDate: string;
  companyEmail: string;
  companyNumber: string;
  status: PanelStatus;
};

export type IPanelListViewOptions = {
  status?: PanelStatus;
  typeId?: number;
  districts: Array<number>;
  wards: Array<number>;
};

export type ILocationListViewOptions = {
  status?: LocationStatus;
  locationTypeId?: number;
  adTypeId?: number;
  districts: Array<number>;
  wards: Array<number>;
};

export type LocationListQueryOptions = ILocationListViewOptions & {
  page?: number;
  limit?: number;
  districts?: Array<number>;
  wards?: Array<number>;
};

export type PanelListQueryOptions = IPanelListViewOptions & {
  page?: number;
  limit?: number;
  districts?: Array<number>;
  wards?: Array<number>;
};

export enum AccountRole {
  DISTRICT_OFFICER = 'district_officer',
  WARD_OFFICER = 'ward_officer',
  CDO = 'cdo',
}

export type Account = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dob?: string;
  role: AccountRole;
  ward?: Ward;
  district?: District;
};

export type AccountDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob?: string;
  phoneNumber?: string;
  role: AccountRole;
  wardId?: number;
  districtId?: number;
};

export type UpdateAccountDto = {
  email: string;
  firstName: string;
  lastName: string;
  dob?: string;
  phoneNumber?: string;
  role: AccountRole;
  wardId?: number;
  districtId?: number;
}

export type IAccountListViewOptions = {
  role?: AccountRole;
};

export type AccountListQueryOptions = IAccountListViewOptions & {
  page?: number;
  limit?: number;
};
