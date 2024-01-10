import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Paper,
  Select,
  SelectChangeEvent,
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
import { LocationStatus } from '@/constants/location';
import { useGetLocationsQuery } from '@/store/api/officer/locationApiSlice';
import { useGetWardsByDistrictIdQuery } from '@/store/api/officer/wardApiSlide';
import { Location, Ward } from '@/types/officer-management';
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

function WardSelect({
  wards,
  setWards,
}: {
  wards: number[];
  setWards: (wards: number[]) => void;
}) {
  const districtId = '18';

  const [allWards, setAllWards] = useState<Ward[]>([]);

  const { data } = useGetWardsByDistrictIdQuery(districtId);

  useEffect(() => {
    if (data) {
      setAllWards(data);
    }
  }, [data]);

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;

    setWards(
      typeof value === 'string' ? value.split(',').map((id) => +id) : value,
    );
  };

  return (
    <FormControl sx={{ width: 250, marginBottom: 2 }}>
      <InputLabel id="select-wards">Wards</InputLabel>
      <Select
        labelId="select-wards"
        id="select-wards"
        multiple
        value={wards}
        onChange={handleChange}
        input={<OutlinedInput label="Wards" />}
        renderValue={(selectedIds) =>
          selectedIds
            .map((id) => allWards.find((ward) => ward.id === id)?.name)
            .join(', ')
        }
        MenuProps={MenuProps}
      >
        {allWards.map((ward) => (
          <MenuItem key={ward?.id} value={ward?.id}>
            <Checkbox checked={wards.indexOf(ward?.id) > -1} />
            <ListItemText primary={ward?.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function LocationList() {
  const role = useAppSelector((state) => state.user?.profile?.role);

  const [page, setPage] = useState<number>(1);
  const [locations, setLocations] = useState<Location[]>([]);
  const [wards, setWards] = useState<number[]>([]);

  const { data, isLoading, refetch } = useGetLocationsQuery({
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
        <WardSelect wards={wards} setWards={setWards} />

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
                locations.map((location: Location) => (
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
                      location?.isPlanning ? 'Yes' : 'No'
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
