import { Switch, FormControlLabel } from '@mui/material';

interface ActionBarProps {
  isShowingAdPanel?: boolean;
  isShowingViolatedReport?: boolean;
  isGettingAllPanels?: boolean;
  isGettingViolatedReport?: boolean;
  onToggleAdPanel: (value: boolean) => void;
  onToggleViolationReport: (value: boolean) => void;
}

const ActionBar = ({
  isShowingAdPanel = false,
  isShowingViolatedReport = false,
  isGettingAllPanels = false,
  isGettingViolatedReport = false,
  onToggleAdPanel,
  onToggleViolationReport,
}: ActionBarProps) => {
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
            checked={isShowingViolatedReport}
            onChange={(e) => onToggleViolationReport(e.target.checked)}
            name="violationReport"
            color="primary"
            disabled={isGettingViolatedReport}
          />
        }
        label="Báo cáo vi phạm"
      />
    </div>
  );
};

export default ActionBar;
