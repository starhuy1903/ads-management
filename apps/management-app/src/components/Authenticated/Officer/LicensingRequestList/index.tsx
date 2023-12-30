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
import { Delete, Info } from '@/components/Common/Icons';
import { ListWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { useGetRequestsQuery } from '@/store/api/officerApiSlice';
import { AdsRequest } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';
import { showError, showSuccess } from '@/utils/toast';

const titles = [
  'ID',
  'Address',
  'Ward',
  'District',
  'Created',
  'Modified',
  'Status',
  '',
];

export default function LicensingRequestList() {
  const [page, setPage] = useState<number>(1);
  const [requests, setRequests] = useState<AdsRequest[] | undefined>([]);

  const { data, isLoading } = useGetRequestsQuery({
    page: page,
    take: 5,
    type: 'APPROVED_PANEL',
  });

  useEffect(() => {
    if (data) {
      setRequests(data.data.adsRequests);
    }
  }, [data]);

  if (isLoading || !requests) {
    return <CenterLoading />;
  }

  const handleDelete = (id: number) => {
    const confirm = window.confirm('Are you sure to delete this request?');

    if (confirm) {
      try {
        // Call API to delete
        showSuccess(`Delete request #${id} successfully!`);
      } catch (error) {
        console.log(error);
        showError(`Delete request #${id} failed!`);
      }
    }
  };

  return (
    <ListWrapper label="List of Licensing Requests">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="advertising points">
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
            {requests.length !== 0 ? (
              requests.map((request: AdsRequest) => (
                <TableRow key={request.id}>
                  <TableCell align="center">{request.id}</TableCell>
                  <TableCell align="center">
                    {request.panel?.location?.full_address}
                  </TableCell>
                  <TableCell align="center">
                    {request.panel?.location?.ward?.name}
                  </TableCell>
                  <TableCell align="center">
                    {request.panel?.location?.district?.name}
                  </TableCell>
                  <TableCell align="center">
                    {formatDateTime(request.createdAt)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDateTime(request.updatedAt)}
                  </TableCell>
                  <TableCell align="center">{request.status}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        height: '100%',
                      }}
                    >
                      <Info link={`/licensing-requests/${request.id}`} />

                      {request.status !== 'Approved' && (
                        <Delete onClick={() => handleDelete(request.id)} />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={8}>
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
    </ListWrapper>
  );
}
