export type AdsLocationResponse = {
  id: string;
  address: string;
  ward: string;
  commue: string;
  lat: number;
  long: number;
  positionType: string;
  adsType: string;
  imageUrl: string;
  isPlanning: boolean;
  createdTime: string;
  modifiedTime: string;
};

export type AdsPanelResponse = {
  id: string;
  panelType: string;
  address: string;
  ward: string;
  district: string;
  width: number;
  height: number;
  quantity: number;
  positionType: string;
  adsType: string;
  imageUrl: string;
  companyEmail: string;
  companyPhone: string;
  createdContractDate: string;
  expiredContractDate: string;
  createdTime: string;
  modifiedTime: string;
};

export type ReportResponse = {
  id: string;
  type: string;
  address: string;
  ward: string;
  district: string;
  fullname: string;
  email: string;
  phone: string;
  content: string;
  resolvedContent: string;
  imageUrls: string[];
  status: string;
  createdTime: string;
  modifiedTime: string;
};
