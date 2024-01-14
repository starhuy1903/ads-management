import { Switch, FormControlLabel } from '@mui/material';

interface ActionBarProps {
  isShowingPlannedLocation?: boolean;
  isShowingViolatedReport?: boolean;
  isGettingAllLocations?: boolean;
  isGettingViolatedReport?: boolean;
  onToggleAdPanel: (value: boolean) => void;
  onToggleViolationReport: (value: boolean) => void;
}

const ActionBar = ({
  isShowingPlannedLocation = false,
  isShowingViolatedReport = false,
  isGettingAllLocations: isGettingAllPanels = false,
  isGettingViolatedReport = false,
  onToggleAdPanel,
  onToggleViolationReport,
}: ActionBarProps) => {
  return (
    <div>
      <FormControlLabel
        control={
          <Switch
            checked={isShowingPlannedLocation}
            onChange={(e) => onToggleAdPanel(e.target.checked)}
            name="adsTable"
            color="primary"
            disabled={isGettingAllPanels}
          />
        }
        label="Planning location"
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
        label="Reports"
      />
    </div>
  );
};

export default ActionBar;
