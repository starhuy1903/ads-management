export interface ReportPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  typeId: number;
  content: string;
  images: File[];
  captcha: string;
  userUuid: string;
  targetType: 'location' | 'panel';
}

export interface CreatedReport {
  fullName: string;
  email: string;
  phoneNumber: string;
  reportType: number;
  description: string;
  imageFiles: File[];
  captcha: string;
}

export interface ReportType {
  id: number;
  value: string;
}
