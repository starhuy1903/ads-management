import { Avatar, Box } from '@mui/material';
import { useCallback, useMemo, useRef } from 'react';
import { Marker } from 'react-map-gl';
import { useAppDispatch, useAppSelector } from '@/store';
import Maps from '@/components/Common/Maps';
import ActionBar from '@/components/Common/Maps/ActionBar';
import SidebarContainer from '@/components/Common/Sidebar';
import { ModalKey } from '@/constants/modal';
import { SidebarKey } from '@/constants/sidebar';
import { useGetLocationsOfficerQuery } from '@/store/api/officer/locationApiSlice';
import { useGetReportsOfficerQuery } from '@/store/api/officer/reportApiSlice';
import {
  setIsShowingPlannedLocation,
  setIsShowingViolatedReport,
} from '@/store/slice/mapsSlice';
import { showModal } from '@/store/slice/modal';
import { showSidebar } from '@/store/slice/sidebar';
import { checkRole } from '@/store/slice/userSlice';
import { AdLocation } from '@/types/location';
import { CreatedPointReport, CreatedReport } from '@/types/report';

const isPointReport = (report: CreatedReport): report is CreatedPointReport =>
  report.targetType === 'Point';

export default function Home() {
  const dispatch = useAppDispatch();
  const {
    isShowingPlannedLocation,
    isShowingViolatedReport,
    selectedLocation,
  } = useAppSelector((state) => state.maps);

  const ref = useRef<any>(null);

  const { profile } = useAppSelector((state) => state.user);
  const { isWardOfficer, isDistrictOfficer } = useAppSelector(checkRole);

  const { data: adLocationData, isLoading: fetchingAllAdsLocation } =
    useGetLocationsOfficerQuery(
      {
        districts: isDistrictOfficer
          ? profile?.district?.id.toString()
          : undefined,
        wards: isWardOfficer ? [profile?.ward?.id as number] : undefined,
      },
      {
        skip: false,
        refetchOnMountOrArgChange: true,
      },
    );
  const { data: vioReports, isLoading: fetchingViolatedReport } =
    useGetReportsOfficerQuery(
      {
        districts: isDistrictOfficer
          ? profile?.district?.id.toString()
          : undefined,
        wards: isWardOfficer ? [profile?.ward?.id as number] : undefined,
      },
      {
        skip: false,
        refetchOnMountOrArgChange: true,
      },
    );

  const vioLocationReports = useMemo(
    () => vioReports?.data.filter((report) => report.targetType === 'Location'),
    [vioReports?.data],
  );

  const vioPanelReports = useMemo(
    () => vioReports?.data.filter((report) => report.targetType === 'Panel'),
    [vioReports?.data],
  );

  const vioPointReports = useMemo(
    () => vioReports?.data.filter((report) => report.targetType === 'Point'),
    [vioReports?.data],
  );

  const handleViewLocationDetail = useCallback(
    (loc: AdLocation) => {
      ref.current?.clearMarker();
      dispatch(
        showSidebar(SidebarKey.AD_DETAIL, {
          location: loc,
          vioLocationReports: vioLocationReports?.filter(
            (report) => report.locationId === loc.id,
          ),
          vioPanelReports,
        }),
      );
    },
    [dispatch, vioLocationReports, vioPanelReports],
  );

  const handleToggleAdPanels = useCallback(
    (value: boolean) => {
      dispatch(setIsShowingPlannedLocation(value));
    },
    [dispatch],
  );

  const handleToggleViolationReport = useCallback(
    (value: boolean) => {
      dispatch(setIsShowingViolatedReport(value));
    },
    [dispatch],
  );

  const renderViolatedPoint = () => {
    if (!vioPointReports) {
      return null;
    }

    return vioPointReports.map((report) => {
      if (isPointReport(report))
        return (
          <Marker
            key={report.id}
            longitude={report.long}
            latitude={report.lat}
            anchor="center"
          >
            <Avatar
              sx={{
                bgcolor: 'red',
                width: 20,
                height: 20,
                fontSize: '10px',
                border: 'none',
              }}
              children=""
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  showModal(ModalKey.REPORT_DETAIL, { reports: [report] }),
                );
              }}
            />
          </Marker>
        );

      return null;
    });
  };

  const renderLocationMarkers = () =>
    adLocationData?.data.map((loc) => {
      let bgColor;
      const isViolatedLocation = vioLocationReports?.find(
        (report) => report.locationId === loc.id,
      );
      const isSelected = selectedLocation?.id === loc.id;

      if (loc.isPlanning && isShowingPlannedLocation) {
        return null;
      }

      if (loc.isPlanning && !isShowingPlannedLocation) {
        bgColor = 'rgb(245 158 11)';
      } else if (isShowingViolatedReport && isViolatedLocation) {
        bgColor = 'red';
      } else {
        bgColor = 'blue';
      }

      const hasAdPanel = loc.panel.length > 0 && !loc.isPlanning;

      return (
        <Marker
          key={loc.id}
          longitude={Number(loc.long)}
          latitude={Number(loc.lat)}
          anchor="center"
        >
          <Avatar
            sx={{
              bgcolor: bgColor,
              width: 20,
              height: 20,
              fontSize: '10px',
              border: isSelected ? '2px solid rgb(103 232 249);' : 'none',
            }}
            children={hasAdPanel ? 'QC' : ''}
            onClick={(e) => {
              e.stopPropagation();
              handleViewLocationDetail(loc);
            }}
          />
        </Marker>
      );
    });

  return (
    <Box position="relative" width="100%" height="100%">
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
        display="flex"
        overflow="hidden"
      >
        <Maps>
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              right: 10,
              background: 'rgb(248 250 252);',
            }}
            padding={1}
          >
            {renderLocationMarkers()}
            {isShowingViolatedReport && renderViolatedPoint()}
            <ActionBar
              isShowingPlannedLocation={isShowingPlannedLocation}
              isShowingViolatedReport={isShowingViolatedReport}
              isGettingAllLocations={fetchingAllAdsLocation}
              isGettingViolatedReport={fetchingViolatedReport}
              onToggleAdPanel={handleToggleAdPanels}
              onToggleViolationReport={handleToggleViolationReport}
            />
          </Box>
        </Maps>
      </Box>
      <SidebarContainer style={{ minWidth: 250, maxWidth: 300 }} />
    </Box>
  );
}
