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
import { useAppDispatch } from '@/store';
import CenterLoading from '@/components/Common/CenterLoading';
import { Cancel, Info } from '@/components/Common/Icons';
import { ListWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { AdsRequestStatus, AdsRequestType } from '@/constants/ads-request';
import { ModalKey } from '@/constants/modal';
import {
  useDeleteRequestMutation,
  useGetRequestsQuery,
} from '@/store/api/officerApiSlice';
import { showModal } from '@/store/slice/modal';
import { AdsRequest } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';
import { capitalize } from '@/utils/format-string';
import { showError, showSuccess } from '@/utils/toast';

const titles = [
  'ID',
  'Location Name',
  'Address',
  'Ward',
  'District',
  'Created Time',
  'Updated Time',
  'Status',
  '',
];

export default function LicensingRequestList() {
  const dispatch = useAppDispatch();

  const [page, setPage] = useState<number>(1);
  const [requests, setRequests] = useState<AdsRequest[] | undefined>([]);

  const { data, isLoading, refetch } = useGetRequestsQuery({
    page: page,
    take: 10,
    type: AdsRequestType?.APPROVED_PANEL,
  });

  const [deleteRequest] = useDeleteRequestMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteRequest(id);
      showSuccess(`Delete request #${id} successfully!`);
      refetch();
    } catch (error) {
      console.log(error);
      showError(`Delete request #${id} failed!`);
    }
  };

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  useEffect(() => {
    if (data) {
      setRequests(data.data);
    }
  }, [data]);

  if (isLoading || !requests) {
    return <CenterLoading />;
  }

  return (
    <ListWrapper label="List of Panel Licensing Requests">
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
                  <TableCell align="center">
                    {request?.panel?.location?.name}
                  </TableCell>
                  <TableCell align="center">
                    {request?.panel?.location?.fullAddress}
                  </TableCell>
                  <TableCell align="center">
                    {request?.panel?.location?.ward?.name}
                  </TableCell>
                  <TableCell align="center">
                    {request?.panel?.location?.district?.name}
                  </TableCell>
                  <TableCell align="center">
                    {formatDateTime(request?.createdAt)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDateTime(request?.updatedAt)}
                  </TableCell>
                  <TableCell align="center">
                    {capitalize(request?.status)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        height: '100%',
                      }}
                    >
                      <Info link={`/licensing-requests/${request?.id}`} />

                      {request?.status === AdsRequestStatus?.PENDING && (
                        <Cancel
                          onClick={() =>
                            dispatch(
                              showModal(ModalKey.CANCEL_REQUEST, {
                                handleDelete: () =>
                                  handleDelete(request?.id?.toString()),
                              }),
                            )
                          }
                        />
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
        count={data?.totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
      />
    </ListWrapper>
  );
}
