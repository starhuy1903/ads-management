export type MessageResponse = {
  success: boolean;
  message: string;
};

export type GetListResult<T> = {
  data: Array<T>;
  totalPages?: number;
  totalCount?: number;
};

export type GetDetailResult<T> = {
  data?: T;
};

type BaseType = {
  id: number;
  createdAt: string;
  updatedAt: string;
};

type RefType = {
  id: number;
  name: string;
};

export type Location = BaseType & {
  lat: string;
  long: string;
  isPlanning: boolean;
  fullAddress: string;
  imageUrls: string[];
  name: string;
  status?: string;
  type: RefType;
  adType: RefType;
  ward: RefType;
  district: RefType;
};

export type Panel = BaseType & {
  width: string;
  height: string;
  imageUrls: string[];
  companyEmail: string;
  companyNumber: string;
  createContractDate: string;
  expiredContractDate: string;
  status?: string;
  location: Location;
  type: RefType;
};

export type PanelType = RefType;

export type LocationType = RefType;

export type AdsType = RefType;

export type Report = BaseType & {
  fullName: string;
  email: string;
  content: string;
  imageUrls: string[];
  targetType: string;
  status: string;
  resolvedContent: string;
  location?: Location;
  panel?: Panel;
  reportType: RefType;
};

export type User = BaseType & {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  ward?: RefType;
  district?: RefType;
};

export type AdsRequest = BaseType & {
  reason: string;
  status: string;
  targetType: string;
  type: string;
  user: User;
  location?: Location;
  panel?: Panel;
};

// DTO
export type PanelDto = {
  images: File[];
  typeId: number;
  width: number;
  height: number;
  locationId: number;
  companyEmail: string;
  companyNumber: string;
  createContractDate: string;
  expiredContractDate: string;
};

export type UpdateLocationDto = {
  belongLocationId: number;
  userId: string;
  typeId: number;
  adsTypeId: number;
  name: string;
  images: File[];
  reason: string;
  lat: string;
  long: string;
  isPlanning: boolean;
  fullAddress: string;
  wardId: number;
  districtId: number;
};

export type UpdatePanelDto = {
  belongPanelId: number;
  locationId: number;
  userId: string;
  typeId: number;
  images: File[];
  width: string;
  height: string;
  createContractDate: string;
  expiredContractDate: string;
  companyEmail: string;
  companyNumber: string;
  reason: string;
};

export type SendPanelRequestDto = {
  userId: string;
  panelId: string;
  reason: string;
};
