import { storage } from './storage';

export class SentReport {
  private reportIds: string[] = [];

  constructor(reportIds: string[]) {
    this.reportIds = reportIds;
  }

  getReportIds() {
    return this.reportIds;
  }

  addReportId(reportId: string) {
    this.reportIds.push(reportId);
    storage.setJson('reportIds', this.reportIds);
  }

  removeReportId(reportId: string) {
    this.reportIds = this.reportIds.filter((id) => id !== reportId);
    storage.setJson('reportIds', this.reportIds);
  }
}

const savedReportIds = (storage.getJson('reportIds') || []) as string[];

const reportStorage = new SentReport(savedReportIds);

export default reportStorage;
