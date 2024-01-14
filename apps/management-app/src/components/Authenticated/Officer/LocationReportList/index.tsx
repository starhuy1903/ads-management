import {
  Box,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import CenterLoading from '@/components/Common/CenterLoading';
import { Info, Response } from '@/components/Common/Icons';
import { ListWrapper } from '@/components/Common/Layout/ScreenWrapper';
import WardSelect from '@/components/Common/WardSelect';
import { UserRole } from '@/constants/user';
import { useGetReportsOfficerQuery } from '@/store/api/officer/reportApiSlice';
import { CreatedLocationReport, CreatedReport } from '@/types/report';
import { formatDateTime } from '@/utils/datetime';
import { capitalize } from '@/utils/format-string';

const titles = [
  'ID',
  'Name',
  'Address',
  'Ward',
  'District',
  'Type',
  'Reporter',
  'Email',
  'Created Time',
  'Updated Time',
  'Status',
  '',
];

const isLocationReport = (
  report: CreatedReport,
): report is CreatedLocationReport => report.targetType === 'Location';

export default function LocationReportList() {
  const role = useAppSelector((state) => state.user?.profile?.role);

  const [page, setPage] = useState<number>(1);
  const [reports, setReports] = useState<CreatedReport[]>([]);
  const [wards, setWards] = useState<number[]>([]);

  const { data, isLoading, refetch } = useGetReportsOfficerQuery(
    {
      page: page,
      take: 10,
      targetType: 'Location',
      wards: wards,
    },
    {
      pollingInterval: 2000,
    },
  );

  useEffect(() => {
    refetch();
  }, [reports, refetch]);

  useEffect(() => {
    if (data) {
      setReports(data.data);
    }
  }, [data]);

  if (isLoading || !reports) {
    return <CenterLoading />;
  }

  return (
    <ListWrapper label="Location Reports">
      <Box
        sx={{
          width: '100%',
        }}
      >
        {role === UserRole?.DISTRICT_OFFICER && (
          <WardSelect wards={wards} setWards={setWards} />
        )}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="location reports">
            <TableHead>
              <TableRow>
                {titles.map((title) => (
                  <TableCell align="center" key={title}>
                    {title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.length !== 0 ? (
                reports.map((report: CreatedReport) => {
                  if (isLocationReport(report)) {
                    return (
                      <TableRow key={report?.id}>
                        <TableCell align="center">{report?.id}</TableCell>
                        <TableCell align="center">
                          {report?.location?.name}
                        </TableCell>
                        <TableCell align="center">
                          {report?.location?.fullAddress}
                        </TableCell>
                        <TableCell align="center">
                          {report?.location?.ward?.name}
                        </TableCell>
                        <TableCell align="center">
                          {report?.location?.district?.name}
                        </TableCell>
                        <TableCell align="center">
                          {report?.reportType?.name}
                        </TableCell>
                        <TableCell align="center">{report?.fullName}</TableCell>
                        <TableCell align="center">{report?.email}</TableCell>
                        <TableCell align="center">
                          {formatDateTime(report?.createdAt)}
                        </TableCell>
                        <TableCell align="center">
                          {formatDateTime(report?.updatedAt)}
                        </TableCell>
                        <TableCell align="center">
                          {capitalize(report?.status)}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                            }}
                          >
                            <Info link={`/location-reports/${report?.id}`} />
                            <Response
                              link={`/reports/${report?.id}/response`}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  }
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={9}>
                    No results
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Pagination
        count={data?.totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
      />
    </ListWrapper>
  );
}
