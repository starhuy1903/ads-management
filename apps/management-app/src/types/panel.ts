import { AdsLocation } from './location';

export type PanelType = {
  id: number;
  name: string;
};

export type Panel = {
  id: number;
  typeId: number;
  width: string;
  height: string;
  locationId: number;
  imageUrls: string[];
  createContractDate: string;
  expiredContractDate: string;
  companyEmail: string;
  companyNumber: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  belongPanelId: number;
  type: PanelType;
  location: AdsLocation;
};
