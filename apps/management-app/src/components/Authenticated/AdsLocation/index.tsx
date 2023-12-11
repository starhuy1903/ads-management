import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AdsLocationResponse } from '@/types/form';
import { formatDateTime } from '@/utils/format-date';

export default function AdsLocation() {
  const rows: AdsLocationResponse[] = [
    {
      id: 1,
      address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
      ward: 'Ben Nghe',
      commue: '1',
      lat: 10.777,
      long: 106.666,
      positionType: 'Public land/Park/Traffic safety corridor',
      adsType: 'Commercial advertising',
      imageUrl:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isPlanning: true,
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 2,
      address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
      ward: 'Ben Nghe',
      commue: '1',
      lat: 10.777,
      long: 106.666,
      positionType: 'Public land/Park/Traffic safety corridor',
      adsType: 'Commercial advertising',
      imageUrl:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isPlanning: true,
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 3,
      address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
      ward: 'Ben Nghe',
      commue: '1',
      lat: 10.777,
      long: 106.666,
      positionType: 'Public land/Park/Traffic safety corridor',
      adsType: 'Commercial advertising',
      imageUrl:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isPlanning: true,
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 4,
      address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
      ward: 'Ben Nghe',
      commue: '1',
      lat: 10.777,
      long: 106.666,
      positionType: 'Public land/Park/Traffic safety corridor',
      adsType: 'Commercial advertising',
      imageUrl:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isPlanning: true,
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 5,
      address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
      ward: 'Ben Nghe',
      commue: '1',
      lat: 10.777,
      long: 106.666,
      positionType: 'Public land/Park/Traffic safety corridor',
      adsType: 'Commercial advertising',
      imageUrl:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isPlanning: true,
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        List of advertising locations
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="advertising points">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Ward</TableCell>
              <TableCell align="center">District</TableCell>
              <TableCell align="center">Position type</TableCell>
              <TableCell align="center">Advertising type</TableCell>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">Latitude</TableCell>
              <TableCell align="center">Longitude</TableCell>
              <TableCell align="center">Planned</TableCell>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">Modified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: AdsLocationResponse) => (
              <TableRow key={row?.id}>
                <TableCell align="center">
                  <Link to={`/locations/${row?.id}`}>{row?.id}</Link>
                </TableCell>
                <TableCell align="center">{row?.address}</TableCell>
                <TableCell align="center">{row?.ward}</TableCell>
                <TableCell align="center">{row?.commue}</TableCell>
                <TableCell align="center">{row?.positionType}</TableCell>
                <TableCell align="center">{row?.adsType}</TableCell>
                <TableCell
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={row?.imageUrl}
                    alt="advertising point"
                    width={120}
                  />
                </TableCell>
                <TableCell align="center">{row?.lat}</TableCell>
                <TableCell align="center">{row?.long}</TableCell>
                <TableCell align="center">{`${
                  row?.isPlanning ? 'Yes' : 'No'
                }`}</TableCell>
                <TableCell align="center">
                  {formatDateTime(row?.createdTime)}
                </TableCell>
                <TableCell align="center">
                  {formatDateTime(row?.modifiedTime)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
