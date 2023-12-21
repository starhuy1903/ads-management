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
import { Edit, Info } from '@/components/Common/Icons';
import { useGetLocationsQuery } from '@/store/api/officerApiSlice';
import { Location } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';

export default function AdsLocation() {
  const [page, setPage] = useState<number>(1);
  const [locations, setLocations] = useState<Location[] | undefined>([]);

  const { data, isLoading } = useGetLocationsQuery({
    page: page,
    take: 10,
    wards: '1',
  });

  useEffect(() => {
    if (data) {
      setLocations(data.data.locations);
    }
  }, [data]);

  if (isLoading || !locations) {
    return <CenterLoading />;
  }

  return (
    <Box
      sx={{
        height: '100%',
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        List of Advertising Locations
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
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">Ward</TableCell>
                <TableCell align="center">District</TableCell>
                <TableCell align="center">Advertising Type</TableCell>
                <TableCell align="center">Position Type</TableCell>
                <TableCell align="center">Planned</TableCell>
                <TableCell align="center">Created</TableCell>
                <TableCell align="center">Modified</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations &&
                locations.map((location: Location) => (
                  <TableRow key={location?.id}>
                    <TableCell align="center">{location?.id}</TableCell>
                    <TableCell align="center">
                      {location?.full_address}
                    </TableCell>
                    <TableCell align="center">{location?.ward?.name}</TableCell>
                    <TableCell align="center">
                      {location?.district.name}
                    </TableCell>
                    <TableCell align="center">
                      {location?.ad_type?.name}
                    </TableCell>
                    <TableCell align="center">{location?.type?.name}</TableCell>
                    <TableCell align="center">{`${
                      location?.isPlanning ? 'Yes' : 'No'
                    }`}</TableCell>
                    <TableCell align="center">
                      {formatDateTime(location?.created_time)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDateTime(location?.modified_time)}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                        }}
                      >
                        <Info link={`/locations/${location?.id}`} />
                        <Edit link={`/locations/${location?.id}/edit`} />
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
