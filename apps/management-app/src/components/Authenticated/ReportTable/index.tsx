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
import { ReportResponse } from '@/types/form';
import { formatDateTime } from '@/utils/format-date';

export default function ReportTable() {
  const rows: ReportResponse[] = [
    {
      id: 1,
      type: 'Opinion contribution',
      fullname: 'Nguyen Van A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'The light of advertising board is too bright, causing discomfort to surrounding people.',
      status: 'Processing',
      imageUrls: [],
      targetType: 'panel',
      target: {
        id: 3,
        panelType: 'Pillar, panel cluster',
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
          'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
        company: {
          email: 'shopee@gmail.com',
          phone: '0123456789',
          createdContractDate: '2023-12-08T11:30:53.945Z',
          expiredContractDate: '2024-01-08T11:30:53.945Z',
        },
        createdTime: '2023-12-08T11:30:53.945Z',
        modifiedTime: '2023-12-08T11:30:53.945Z',
      },
      resolvedContent: '',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 2,
      type: 'Opinion contribution',
      fullname: 'Nguyen Van A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'The light of advertising board is too bright, causing discomfort to surrounding people.',
      status: 'Processing',
      imageUrls: [],
      targetType: 'panel',
      target: {
        id: 3,
        panelType: 'Pillar, panel cluster',
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
          'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
        company: {
          email: 'shopee@gmail.com',
          phone: '0123456789',
          createdContractDate: '2023-12-08T11:30:53.945Z',
          expiredContractDate: '2024-01-08T11:30:53.945Z',
        },
        createdTime: '2023-12-08T11:30:53.945Z',
        modifiedTime: '2023-12-08T11:30:53.945Z',
      },
      resolvedContent: '',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 3,
      type: 'Opinion contribution',
      fullname: 'Nguyen Van A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'The light of advertising board is too bright, causing discomfort to surrounding people.',
      status: 'Processing',
      imageUrls: [],
      targetType: 'panel',
      target: {
        id: 3,
        panelType: 'Pillar, panel cluster',
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
          'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
        company: {
          email: 'shopee@gmail.com',
          phone: '0123456789',
          createdContractDate: '2023-12-08T11:30:53.945Z',
          expiredContractDate: '2024-01-08T11:30:53.945Z',
        },
        createdTime: '2023-12-08T11:30:53.945Z',
        modifiedTime: '2023-12-08T11:30:53.945Z',
      },
      resolvedContent: '',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 4,
      type: 'Opinion contribution',
      fullname: 'Nguyen Van A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'The light of advertising board is too bright, causing discomfort to surrounding people.',
      status: 'Processing',
      imageUrls: [],
      targetType: 'panel',
      target: {
        id: 3,
        panelType: 'Pillar, panel cluster',
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
          'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
        company: {
          email: 'shopee@gmail.com',
          phone: '0123456789',
          createdContractDate: '2023-12-08T11:30:53.945Z',
          expiredContractDate: '2024-01-08T11:30:53.945Z',
        },
        createdTime: '2023-12-08T11:30:53.945Z',
        modifiedTime: '2023-12-08T11:30:53.945Z',
      },
      resolvedContent: '',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 5,
      type: 'Opinion contribution',
      fullname: 'Nguyen Van A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'The light of advertising board is too bright, causing discomfort to surrounding people.',
      status: 'Processing',
      imageUrls: [],
      targetType: 'panel',
      target: {
        id: 3,
        panelType: 'Pillar, panel cluster',
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
          'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
        company: {
          email: 'shopee@gmail.com',
          phone: '0123456789',
          createdContractDate: '2023-12-08T11:30:53.945Z',
          expiredContractDate: '2024-01-08T11:30:53.945Z',
        },
        createdTime: '2023-12-08T11:30:53.945Z',
        modifiedTime: '2023-12-08T11:30:53.945Z',
      },
      resolvedContent: '',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        List of Reports
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="advertising points">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Content</TableCell>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">Modified</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: ReportResponse) => (
              <TableRow key={row?.id}>
                <TableCell align="center">
                  <Link to={`/reports/${row?.id}`}>{row?.id}</Link>
                </TableCell>
                <TableCell align="center">{row?.type}</TableCell>
                <TableCell align="center">{row?.fullname}</TableCell>
                <TableCell align="center">{row?.email}</TableCell>
                <TableCell align="center">{row?.phone}</TableCell>
                <TableCell>{row?.content}</TableCell>
                <TableCell align="center">
                  {formatDateTime(row?.createdTime)}
                </TableCell>
                <TableCell align="center">
                  {formatDateTime(row?.modifiedTime)}
                </TableCell>
                <TableCell align="center">{row?.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
