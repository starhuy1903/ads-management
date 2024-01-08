import { Switch, FormControlLabel } from '@mui/material';
import { ChangeEvent, useCallback, useState } from 'react';

interface ActionBarProps {
  isShowingAdPanel?: boolean;
  isGettingAllPanels?: boolean;
  onToggleAdPanel: (value: boolean) => void;
  onToggleViolationReport: () => void;
}

const ActionBar = ({
  isShowingAdPanel = false,
  isGettingAllPanels = false,
  onToggleAdPanel,
  onToggleViolationReport,
}: ActionBarProps) => {
  const [isShowingViolationReport, setIsShowingViolationReport] =
    useState(false);

  const handleViolationReportToggle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.checked;
      setIsShowingViolationReport(value);
      value && onToggleViolationReport();
    },
    [onToggleViolationReport],
  );

  return (
    <div>
      <FormControlLabel
        control={
          <Switch
            checked={isShowingAdPanel}
            onChange={(e) => onToggleAdPanel(e.target.checked)}
            name="adsTable"
            color="primary"
            disabled={isGettingAllPanels}
          />
        }
        label="Bảng QC"
      />
      <FormControlLabel
        control={
          <Switch
            checked={isShowingViolationReport}
            onChange={handleViolationReportToggle}
            name="violationReport"
            color="primary"
          />
        }
        label="Báo cáo vi phạm"
      />
    </div>
  );
};

export default ActionBar;
