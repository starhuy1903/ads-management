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
import { useGetLocationsQuery } from '@/store/api/officerApiSlice';
import { Location } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';

const titles = [
  'ID',
  'Address',
  'Ward',
  'District',
  'Ad Type',
  'Type',
  'Planning',
  'Created',
  'Modified',
  '',
];

export default function LocationList() {
  const [page, setPage] = useState<number>(1);
  const [locations, setLocations] = useState<Location[] | undefined>([]);

  const { data, isLoading } = useGetLocationsQuery({
    page: page,
    take: 10,
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
    <ListWrapper label="List of Advertising Locations">
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
            {locations?.length !== 0 ? (
              locations.map((location: Location) => (
                <TableRow key={location?.id}>
                  <TableCell align="center">{location?.id}</TableCell>
                  <TableCell align="center">{location?.full_address}</TableCell>
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
    </ListWrapper>
  );
}
