import { AdsType } from './ads';
import { District } from './cdoManagement';

export type LocationType = {
  id: number;
  name: string;
};

export interface AdsLocation {
  id: number;
  lat: number;
  long: number;
  isPlaning: boolean;
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
  status: string; // TODO: refactor
  panel: any[];
  type: LocationType;
  adType: AdsType;
  district: District;
  ward: {
    id: number;
    name: string;
    districtId: number;
  };
}
