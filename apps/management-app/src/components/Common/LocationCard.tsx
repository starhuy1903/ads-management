import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { ModalKey } from '@/constants/modal';
import { showModal } from '@/store/slice/modal';
import { checkRole } from '@/store/slice/userSlice';
import { AdLocation } from '@/types/location';
import { CreatedReport } from '@/types/report';

interface LocationCardProps {
  data: AdLocation;
  hasReported?: boolean;
  reports?: CreatedReport[];
}

export default function LocationCard({
  data,
  hasReported = false,
  reports = [],
}: LocationCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isCitizen, isDistrictOfficer, isWardOfficer } =
    useAppSelector(checkRole);

  const goToReport = useCallback(() => {
    navigate(`/report?location=${data.id}`);
  }, [navigate, data.id]);

  const goToHandleReport = useCallback(
    (reportId: number) => {
      navigate(`/reports/${reportId}/response`);
    },
    [navigate],
  );

  const viewAllReports = useCallback(() => {
    dispatch(
      showModal(ModalKey.REPORT_DETAIL, {
        reports,
        createNew: isCitizen ? goToReport : undefined,
        onHandleReport:
          isDistrictOfficer || isWardOfficer
            ? (reportId: number) => goToHandleReport(reportId)
            : undefined,
      }),
    );
  }, [
    dispatch,
    reports,
    goToReport,
    isCitizen,
    isDistrictOfficer,
    isWardOfficer,
    goToHandleReport,
  ]);

  return (
    <Card sx={{ background: 'rgb(240 253 244)' }}>
      <CardHeader
        title="Thông tin địa điểm"
        titleTypographyProps={{ fontWeight: 500 }}
      />
      <CardContent>
        <Typography fontWeight={500}>{data.adType.name}</Typography>
        <Typography fontStyle="italic">{data.type.name}</Typography>
        <Typography>{data.fullAddress}</Typography>
        <Typography fontWeight={500} fontStyle="italic">
          {data.isPlanning ? 'CHƯA QUY HOẠCH' : 'ĐÃ QUY HOẠCH'}
        </Typography>
      </CardContent>
      <CardActions>
        {isCitizen && (
          <Button
            variant="outlined"
            color="error"
            onClick={hasReported ? viewAllReports : goToReport}
            sx={{ textTransform: 'uppercase' }}
          >
            {hasReported ? 'Xem lại báo cáo' : 'Báo cáo vi phạm'}
          </Button>
        )}
        {!isCitizen && hasReported && (
          <Button
            variant="outlined"
            color="error"
            onClick={viewAllReports}
            sx={{ textTransform: 'uppercase' }}
          >
            Xem báo cáo
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
