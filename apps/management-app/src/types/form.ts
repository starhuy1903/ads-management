export type AdsLocationResponse = {
  id: number;
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
  id: number;
  panelType: string;
  location: {
    address: string;
    ward: string;
    commue: string;
    positionType: string;
    adsType: string;
  };
  width: number;
  height: number;
  quantity: number;
  imageUrl: string;
  company: {
    email: string;
    phone: string;
    createdContractDate: string;
    expiredContractDate: string;
  };
  createdTime: string;
  modifiedTime: string;
};

export type ReportResponse = {
  id: number;
  type: string;
  fullname: string;
  email: string;
  phone: string;
  content: string;
  imageUrls: string[];
  targetType: string;
  target: AdsLocationResponse | AdsPanelResponse;
  status: string;
  resolvedContent: string;
  createdTime: string;
  modifiedTime: string;
};

export type AdsPermissionResponse = {
  id: number;
  reason: string;
  status: string;
  panel: AdsPanelResponse;
  createdTime: string;
  modifiedTime: string;
};
