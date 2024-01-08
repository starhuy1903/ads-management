import { AdType } from './ads';
import { District } from './cdoManagement';

export type LocationType = {
  id: number;
  name: string;
};

export interface AdLocation {
  id: number;
  lat: number;
  long: number;
  isPlanning: boolean;
  districtId: number;
  wardId: number;
  fullAddress: string;
  typeId: number;
  adTypeId: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  name: string;
  belongLocationId: number;
  status: string; // TODO: use enum
  panel: any[];
  type: LocationType;
  adType: AdType;
  district: District;
  ward: {
    id: number;
    name: string;
    districtId: number;
  };
}
