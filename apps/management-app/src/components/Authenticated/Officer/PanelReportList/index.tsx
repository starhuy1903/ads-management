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
import CenterLoading from '@/components/Common/CenterLoading';
import { Info, Response } from '@/components/Common/Icons';
import { ListWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { useGetReportsQuery } from '@/store/api/officerApiSlice';
import { Report } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';

const titles = [
  'ID',
  'Type',
  'Name',
  'Email',
  'Created Time',
  'Updated Time',
  'Status',
  '',
];

export default function PanelReportList() {
  const [page, setPage] = useState<number>(1);
  const [reports, setReports] = useState<Report[] | undefined>([]);

  const { data, isLoading } = useGetReportsQuery({
    page: page,
    take: 10,
    targetType: 'Panel',
    typeId: 1,
  });

  useEffect(() => {
    if (data) {
      setReports(data.data);
    }
  }, [data]);

  if (isLoading || !reports) {
    return <CenterLoading />;
  }

  return (
    <ListWrapper label="List of Panel Reports">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="panel reports">
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
              reports.map((report: Report) => (
                <TableRow key={report?.id}>
                  <TableCell align="center">{report?.id}</TableCell>
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
                  <TableCell align="center">{report?.status}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                      }}
                    >
                      <Info link={`/panel-reports/${report?.id}`} />
                      <Response link={`/reports/${report?.id}/response`} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={9}>
                  No rows
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={data?.totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
      />
    </ListWrapper>
  );
}
