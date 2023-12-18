export interface ReportPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  reportType: number;
  description: string;
  imageFiles: File[];
  captcha: string;
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
