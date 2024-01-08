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
import { Edit, Info, Response } from '@/components/Common/Icons';
import { ListWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { PanelStatus } from '@/constants/panel';
import { useGetPanelsQuery } from '@/store/api/officerApiSlice';
import { Panel } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';
import { capitalize } from '@/utils/format-string';

const titles = [
  'ID',
  'Location Name',
  'Address',
  'Ward',
  'District',
  'Company Email',
  'Created Time',
  'Updated Time',
  'Status',
  '',
];

export default function PanelList() {
  const [page, setPage] = useState<number>(1);
  const [panels, setPanels] = useState<Panel[] | undefined>([]);

  const { data, isLoading, refetch } = useGetPanelsQuery({
    page: page,
    take: 10,
  });

  useEffect(() => {
    refetch();
  }, [panels, refetch]);

  useEffect(() => {
    if (data) {
      setPanels(data.data);
    }
  }, [data]);

  if (isLoading || !panels) {
    return <CenterLoading />;
  }

  return (
    <ListWrapper
      label="List of Advertising Panels"
      btnLabel="Create"
      btnLink={'/panels/create'}
    >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="panels">
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
            {panels &&
              panels.map((panel: Panel) => (
                <TableRow key={panel?.id}>
                  <TableCell align="center">{panel?.id}</TableCell>
                  <TableCell align="center">{panel?.location?.name}</TableCell>
                  <TableCell align="center">
                    {panel?.location?.fullAddress}
                  </TableCell>
                  <TableCell align="center">
                    {panel?.location?.ward?.name}
                  </TableCell>
                  <TableCell align="center">
                    {panel?.location?.district?.name}
                  </TableCell>
                  <TableCell align="center">{panel?.companyEmail}</TableCell>
                  <TableCell align="center">
                    {formatDateTime(panel?.createdAt)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDateTime(panel?.updatedAt)}
                  </TableCell>
                  <TableCell align="center">
                    {capitalize(panel?.status)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                      }}
                    >
                      <Info link={`/panels/${panel?.id}`} />
                      <Edit link={`/panels/${panel?.id}/edit`} />

                      {panel?.status === PanelStatus?.DRAFT && (
                        <Response link={`/panels/${panel?.id}/send-request`} />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
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
