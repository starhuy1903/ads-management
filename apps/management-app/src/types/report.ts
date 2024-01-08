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

export type ReportPayload = LocationReport | PanelReport;

export interface CreatedReport {
  id: number;
  typeId: number;
  fullName: string;
  email: string;
  content: string;
  phoneNumber: string;
  imageUrl: string[];
  targetType: ReportTargetType;
  locationId?: number;
  panelId?: number;
  status: 'Mới';
  resolvedContent: string;
  createdAt: string;
  updatedAt: string;
  userUuid: string;
}

export type ReportType = {
  id: number;
  name: string;
};
