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
import { Edit, Info } from '@/components/Common/Icons';
import { ListWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { useGetPanelsQuery } from '@/store/api/officerApiSlice';
import { Panel } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';

const titles = [
  'ID',
  'Address',
  'Ward',
  'District',
  'Panel Type',
  'Company Email',
  'Started',
  'Ended',
  'Created',
  'Modified',
  'Status',
  '',
];

export default function PanelList() {
  const [page, setPage] = useState<number>(1);
  const [panels, setPanels] = useState<Panel[] | undefined>([]);

  const { data, isLoading } = useGetPanelsQuery({
    page: page,
    take: 10,
  });

  useEffect(() => {
    if (data) {
      setPanels(data.data.panels);
    }
  }, [data]);

  if (isLoading || !panels) {
    return <CenterLoading />;
  }

  return (
    <ListWrapper label="List of Advertising Panels">
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
            {panels &&
              panels.map((panel: Panel) => (
                <TableRow key={panel?.id}>
                  <TableCell align="center">{panel?.id}</TableCell>
                  <TableCell align="center">
                    {panel?.location?.full_address}
                  </TableCell>
                  <TableCell align="center">
                    {panel?.location?.ward?.name}
                  </TableCell>
                  <TableCell align="center">
                    {panel?.location?.district?.name}
                  </TableCell>
                  <TableCell align="center">{panel?.type?.name}</TableCell>
                  <TableCell align="center">{panel?.company_email}</TableCell>
                  <TableCell align="center">
                    {formatDateTime(panel?.create_contract_date)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDateTime(panel?.expired_contract_date)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDateTime(panel?.created_time)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDateTime(panel?.modified_time)}
                  </TableCell>

                  <TableCell align="center">{panel?.status}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                      }}
                    >
                      <Info link={`/panels/${panel?.id}`} />
                      <Edit link={`/panels/${panel?.id}/edit`} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
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
