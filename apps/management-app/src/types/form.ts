export type AdsLocationResponse = {
  id: string;
  address: string;
  ward: string;
  district: string;
  positionType: string;
  adsType: string;
  image: string;
  isZoning: string;
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
};

export type ReportResponse = {
  id: string;
  reportType: string;
  sentAt: string;
  address: string;
  ward: string;
  district: string;
  name: string;
  email: string;
  phone: string;
  content: string;
  images?: string[];
};
