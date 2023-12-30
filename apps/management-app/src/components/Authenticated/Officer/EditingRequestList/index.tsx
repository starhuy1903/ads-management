import {
  Box,
  MenuItem,
  Pagination,
  Paper,
  Select,
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
import { AdsRequestType, TargetType } from '@/constants/ads-request';
import { useGetRequestsQuery } from '@/store/api/officerApiSlice';
import { AdsRequest } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';
import { showError, showSuccess } from '@/utils/toast';

const titles = [
  'ID',
  'Target Type',
  'Address',
  'Ward',
  'District',
  'Created Time',
  'Updated Time',
  'Status',
  '',
];

export default function EditingRequestList() {
  const [targetType, setTargetType] = useState<TargetType>(TargetType.PANEL);
  const [page, setPage] = useState<number>(1);
  const [requests, setRequests] = useState<AdsRequest[] | undefined>([]);

  const { data, isLoading } = useGetRequestsQuery({
    page: page,
    take: 5,
    type: AdsRequestType.UPDATE_DATA,
    targetType: targetType,
  });

  useEffect(() => {
    if (data) {
      setRequests(data.data);
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
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Select
          value={targetType}
          onChange={(event) => setTargetType(event.target.value as TargetType)}
          sx={{
            mb: 2,
            width: '10%',
          }}
        >
          <MenuItem value={TargetType?.PANEL}>Panel</MenuItem>
          <MenuItem value={TargetType?.LOCATION}>Location</MenuItem>
        </Select>

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
                  <TableRow key={request?.id}>
                    <TableCell align="center">{request?.id}</TableCell>
                    <TableCell align="center">{request?.targetType}</TableCell>
                    <TableCell align="center">
                      {targetType === TargetType.LOCATION
                        ? request?.location?.fullAddress
                        : request?.panel?.location?.fullAddress}
                    </TableCell>
                    <TableCell align="center">
                      {targetType === TargetType.LOCATION
                        ? request?.location?.ward?.name
                        : request?.panel?.location?.ward?.name}
                    </TableCell>
                    <TableCell align="center">
                      {targetType === TargetType.LOCATION
                        ? request?.location?.district?.name
                        : request?.panel?.location?.district?.name}
                    </TableCell>
                    <TableCell align="center">
                      {formatDateTime(request?.createdAt)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDateTime(request?.updatedAt)}
                    </TableCell>
                    <TableCell align="center">{request?.status}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          height: '100%',
                        }}
                      >
                        <Info link={`/editing-requests/${request?.id}`} />

                        {request?.status !== 'Approved' && (
                          <Delete onClick={() => handleDelete(request?.id)} />
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
      </Box>

      <Pagination
        count={data?.totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
      />
    </ListWrapper>
  );
}