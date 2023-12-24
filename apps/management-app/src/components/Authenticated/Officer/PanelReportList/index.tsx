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
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CenterLoading from '@/components/Common/CenterLoading';
import { Info, Response } from '@/components/Common/Icons';
import { useGetReportsQuery } from '@/store/api/reportApiSlice';
import { Report } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';

export default function PanelReportList() {
  const [page, setPage] = useState<number>(1);
  const [reports, setReports] = useState<Report[] | undefined>([]);

  const { data, isLoading } = useGetReportsQuery({
    page: page,
    take: 5,
    wards: '1',
    targetType: 'Panel',
    typeId: 1,
  });

  useEffect(() => {
    if (data) {
      setReports(data.data.reports);
    }
  }, [data]);

  if (isLoading || !reports) {
    return <CenterLoading />;
  }

  return (
    <Box
      sx={{
        height: '100%',
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        List of Panel Reports
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '90%',
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="advertising points">
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Created</TableCell>
                <TableCell align="center">Modified</TableCell>
                <TableCell align="center">Content</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.length !== 0 ? (
                reports.map((report: Report) => (
                  <TableRow key={report?.id}>
                    <TableCell align="center">{report?.id}</TableCell>
                    <TableCell align="center">
                      {report?.report_type?.name}
                    </TableCell>
                    <TableCell align="center">{report?.fullname}</TableCell>
                    <TableCell align="center">{report?.email}</TableCell>
                    <TableCell align="center">
                      {formatDateTime(report?.createdAt)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDateTime(report?.updatedAt)}
                    </TableCell>
                    <TableCell>{report?.content}</TableCell>
                    <TableCell align="center">{report?.status}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                        }}
                      >
                        <Info link={`/reports/${report?.id}`} />
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
          count={data?.data.totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
}
