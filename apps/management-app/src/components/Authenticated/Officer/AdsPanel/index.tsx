import {
  Box,
  Button,
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
import { Link } from 'react-router-dom';
import CenterLoading from '@/components/Common/CenterLoading';
import { Edit, Info } from '@/components/Common/Icons';
import { useGetPanelsQuery } from '@/store/api/officerApiSlice';
import { Panel } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';

export default function AdsPanel() {
  const [page, setPage] = useState<number>(1);
  const [panels, setPanels] = useState<Panel[] | undefined>([]);

  const { data, isLoading } = useGetPanelsQuery({
    page: page,
    take: 10,
    districts: '1',
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
    <Box
      sx={{
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          List of Advertising Panels
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/panels/create"
          sx={{
            color: 'white',
          }}
        >
          Create
        </Button>
      </Box>

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
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">Ward</TableCell>
                <TableCell align="center">District</TableCell>
                <TableCell align="center">Panel Type</TableCell>
                <TableCell align="center">Company Email</TableCell>
                <TableCell align="center">Started</TableCell>
                <TableCell align="center">Ended</TableCell>
                <TableCell align="center">Created</TableCell>
                <TableCell align="center">Modified</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center"></TableCell>
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
      </Box>
    </Box>
  );
}
