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
import { useAppSelector } from '@/store';
import CenterLoading from '@/components/Common/CenterLoading';
import { Edit, Info } from '@/components/Common/Icons';
import { ListWrapper } from '@/components/Common/Layout/ScreenWrapper';
import WardSelect from '@/components/Common/WardSelect';
import { LocationStatus } from '@/constants/location';
import { UserRole } from '@/constants/user';
import { useGetLocationsOfficerQuery } from '@/store/api/officer/locationApiSlice';
import { AdLocation } from '@/types/location';
import { formatDateTime } from '@/utils/datetime';
import { capitalize } from '@/utils/format-string';

const titles = [
  'ID',
  'Name',
  'Address',
  'Ward',
  'District',
  'Planned',
  'Created Time',
  'Updated Time',
  'Status',
  '',
];

export default function LocationList() {
  const role = useAppSelector((state) => state.user?.profile?.role);

  const [page, setPage] = useState<number>(1);
  const [locations, setLocations] = useState<AdLocation[]>([]);
  const [wards, setWards] = useState<number[]>([]);

  const { data, isLoading, refetch } = useGetLocationsOfficerQuery({
    page: page,
    take: 10,
    status: LocationStatus?.APPROVED,
    wards: wards,
  });

  useEffect(() => {
    refetch();
  }, [locations, page, refetch, wards]);

  useEffect(() => {
    if (data) {
      setLocations(data.data);
    }
  }, [data]);

  if (isLoading || !locations) {
    return <CenterLoading />;
  }

  return (
    <ListWrapper label="Locations">
      <Box
        sx={{
          width: '100%',
        }}
      >
        {role === UserRole?.DISTRICT_OFFICER && (
          <WardSelect wards={wards} setWards={setWards} />
        )}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="locations">
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
                locations.map((location: AdLocation) => (
                  <TableRow key={location?.id}>
                    <TableCell align="center">{location?.id}</TableCell>
                    <TableCell align="center">{location?.name}</TableCell>
                    <TableCell align="center">
                      {location?.fullAddress}
                    </TableCell>
                    <TableCell align="center">{location?.ward?.name}</TableCell>
                    <TableCell align="center">
                      {location?.district?.name}
                    </TableCell>
                    <TableCell align="center">{`${
                      location?.isPlanning ? 'No' : 'Yes'
                    }`}</TableCell>
                    <TableCell align="center">
                      {formatDateTime(location?.createdAt)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDateTime(location?.updatedAt)}
                    </TableCell>
                    <TableCell align="center">
                      {capitalize(location?.status)}
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
                    No results
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
