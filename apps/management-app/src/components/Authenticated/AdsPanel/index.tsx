import {
  Box,
  Button,
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
import { Edit, Info } from '@/components/Common/Icons';
import { AdsPanelResponse } from '@/types/form';
import { formatDate, formatDateTime } from '@/utils/format-date';

export default function AdsPanel() {
  const rows: AdsPanelResponse[] = [
    {
      id: 1,
      panelType: 'Pillar/Panel cluster',
      location: {
        address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
        ward: 'Ben Nghe',
        commue: '1',
        positionType: 'Public land/Park/Traffic safety corridor',
        adsType: 'Commercial advertising',
      },
      width: 2.5,
      height: 10,
      quantity: 1,
      imageUrl:
        'https://cdn.tuoitrethudo.com.vn/stores/news_dataimages/ngovuongtuan/122021/06/14/711e32670b0f625bf1252c028017da66.png?rt=20211206144254',
      company: {
        email: 'shopee@gmail.com',
        phone: '0123456789',
        createdContractDate: '2023-12-01',
        expiredContractDate: '2024-01-01',
      },
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 2,
      panelType: 'Pillar/Panel cluster',
      location: {
        address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
        ward: 'Ben Nghe',
        commue: '1',
        positionType: 'Public land/Park/Traffic safety corridor',
        adsType: 'Commercial advertising',
      },
      width: 2.5,
      height: 10,
      quantity: 1,
      imageUrl:
        'https://cdn.tuoitrethudo.com.vn/stores/news_dataimages/ngovuongtuan/122021/06/14/711e32670b0f625bf1252c028017da66.png?rt=20211206144254',
      company: {
        email: 'shopee@gmail.com',
        phone: '0123456789',
        createdContractDate: '2023-12-01',
        expiredContractDate: '2024-01-01',
      },
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 3,
      panelType: 'Pillar/Panel cluster',
      location: {
        address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
        ward: 'Ben Nghe',
        commue: '1',
        positionType: 'Public land/Park/Traffic safety corridor',
        adsType: 'Commercial advertising',
      },
      width: 2.5,
      height: 10,
      quantity: 1,
      imageUrl:
        'https://cdn.tuoitrethudo.com.vn/stores/news_dataimages/ngovuongtuan/122021/06/14/711e32670b0f625bf1252c028017da66.png?rt=20211206144254',
      company: {
        email: 'shopee@gmail.com',
        phone: '0123456789',
        createdContractDate: '2023-12-01',
        expiredContractDate: '2024-01-01',
      },
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 4,
      panelType: 'Pillar/Panel cluster',
      location: {
        address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
        ward: 'Ben Nghe',
        commue: '1',
        positionType: 'Public land/Park/Traffic safety corridor',
        adsType: 'Commercial advertising',
      },
      width: 2.5,
      height: 10,
      quantity: 1,
      imageUrl:
        'https://cdn.tuoitrethudo.com.vn/stores/news_dataimages/ngovuongtuan/122021/06/14/711e32670b0f625bf1252c028017da66.png?rt=20211206144254',
      company: {
        email: 'shopee@gmail.com',
        phone: '0123456789',
        createdContractDate: '2023-12-01',
        expiredContractDate: '2024-01-01',
      },
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 5,
      panelType: 'Pillar/Panel cluster',
      location: {
        address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
        ward: 'Ben Nghe',
        commue: '1',
        positionType: 'Public land/Park/Traffic safety corridor',
        adsType: 'Commercial advertising',
      },
      width: 2.5,
      height: 10,
      quantity: 1,
      imageUrl:
        'https://cdn.tuoitrethudo.com.vn/stores/news_dataimages/ngovuongtuan/122021/06/14/711e32670b0f625bf1252c028017da66.png?rt=20211206144254',
      company: {
        email: 'shopee@gmail.com',
        phone: '0123456789',
        createdContractDate: '2023-12-01',
        expiredContractDate: '2024-01-01',
      },
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="advertising points">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Panel type</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Ward</TableCell>
              <TableCell align="center">District</TableCell>
              <TableCell align="center">Company email</TableCell>
              <TableCell align="center">Started</TableCell>
              <TableCell align="center">Ended</TableCell>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">Modified</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: AdsPanelResponse) => (
              <TableRow key={row?.id}>
                <TableCell align="center">{row?.id}</TableCell>
                <TableCell align="center">{row?.panelType}</TableCell>
                <TableCell align="center">{row?.location?.address}</TableCell>
                <TableCell align="center">{row?.location?.ward}</TableCell>
                <TableCell align="center">{row?.location?.commue}</TableCell>
                <TableCell align="center">{row?.company?.email}</TableCell>
                <TableCell align="center">
                  {formatDate(row?.company?.createdContractDate)}
                </TableCell>
                <TableCell align="center">
                  {formatDate(row?.company?.expiredContractDate)}
                </TableCell>
                <TableCell align="center">
                  {formatDateTime(row?.createdTime)}
                </TableCell>
                <TableCell align="center">
                  {formatDateTime(row?.modifiedTime)}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                    }}
                  >
                    <Info link={`/panels/${row?.id}`} />
                    <Edit link={`/panels/${row?.id}/edit`} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
