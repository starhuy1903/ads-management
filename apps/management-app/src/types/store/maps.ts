import { AdLocation } from '../location';

export interface MapsSlice {
  isShowingPlannedLocation: boolean;
  isShowingViolatedReport: boolean;
  selectedLocation: AdLocation | null;
}
