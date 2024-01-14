import { AdLocation } from './location';
import { District, Ward } from './officer-management';
import { Panel } from './panel';

export interface CreateReportForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  typeId: number;
  content: string;
  images: File[];
  captcha: string;
}

export type ReportTargetType = 'Location' | 'Panel';

type LocationReport = {
  userUuid: string;
  targetType: 'Location';
  locationId: number;
} & CreateReportForm;

type PanelReport = {
  userUuid: string;
  targetType: 'Panel';
  panelId: number;
} & CreateReportForm;

type AnyPointReport = {
  userUuid: string;
  targetType: 'Point';
  lat: number;
  long: number;
} & CreateReportForm;

export type ReportPayload = LocationReport | PanelReport | AnyPointReport;

export type ReportType = {
  id: number;
  name: string;
};

export interface CreatedReportBase {
  id: number;
  typeId: number;
  fullName: string;
  email: string;
  content: string;
  phoneNumber: string;
  imageUrls: string[];
  status: string;
  resolvedContent: string;
  createdAt: string;
  updatedAt: string;
  userUuid: string;
  reportType: ReportType;
}

export interface CreatedLocationReport extends CreatedReportBase {
  targetType: 'Location';
  locationId: number;
  panelId: null;
  location: AdLocation;
}

export interface CreatedPanelReport extends CreatedReportBase {
  targetType: 'Panel';
  panelId: number;
  locationId: null;
  panel: Panel;
}

export interface CreatedPointReport extends CreatedReportBase {
  targetType: 'Point';
  panelId: null;
  locationId: null;
  lat: number;
  long: number;
  district?: District;
  ward?: Ward;
}

export type CreatedReport =
  | CreatedLocationReport
  | CreatedPanelReport
  | CreatedPointReport;
