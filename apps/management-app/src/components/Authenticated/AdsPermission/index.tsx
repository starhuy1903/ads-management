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
import { Delete, Info } from '@/components/Common/Icons';
import { AdsPermissionResponse } from '@/types/form';
import { formatDateTime } from '@/utils/format-date';
import { showError, showSuccess } from '@/utils/toast';

export default function AdsPermission() {
  const rows: AdsPermissionResponse[] = [
    {
      id: 1,
      type: 'Licensing request',
      panel: {
        id: 2,
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
      reason: 'Advertise products and services for the company',
      status: 'Approved',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 2,
      type: 'Licensing request',
      panel: {
        id: 2,
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
      reason: 'Advertise products and services for the company',
      status: 'Processing',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 3,
      type: 'Licensing request',
      panel: {
        id: 2,
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
      reason: 'Advertise products and services for the company',
      status: 'Approved',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 4,
      type: 'Licensing request',
      panel: {
        id: 2,
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
      reason: 'Advertise products and services for the company',
      status: 'Processing',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 5,
      type: 'Licensing request',
      panel: {
        id: 2,
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
      reason: 'Advertise products and services for the company',
      status: 'Approved',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
  ];

  const handleDelete = (id: number) => {
    const confirm = window.confirm('Are you sure to delete this request?');

    if (confirm) {
      try {
        // Call API to delete
        showSuccess(`Delete request #${id} successfully!`);
      } catch (error) {
        console.log(error);
        showError(`Delete request #${id} failed!`);
      }
    }
  };

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
          List of Licensing Request
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/permissions/new"
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
              <TableCell align="center">Request type</TableCell>
              <TableCell align="center">Advertising type</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Ward</TableCell>
              <TableCell align="center">District</TableCell>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">Modified</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: AdsPermissionResponse) => (
              <TableRow key={row?.id}>
                <TableCell align="center">{row?.id}</TableCell>
                <TableCell align="center">{row?.type}</TableCell>
                <TableCell align="center">{row?.panel?.panelType}</TableCell>
                <TableCell align="center">{row?.panel?.quantity}</TableCell>
                <TableCell align="center">
                  {row?.panel?.location?.address}
                </TableCell>
                <TableCell align="center">
                  {row?.panel?.location?.ward}
                </TableCell>
                <TableCell align="center">
                  {row?.panel?.location?.commue}
                </TableCell>
                <TableCell align="center">
                  {formatDateTime(row?.createdTime)}
                </TableCell>
                <TableCell align="center">
                  {formatDateTime(row?.modifiedTime)}
                </TableCell>
                <TableCell align="center">{row?.status}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      height: '100%',
                    }}
                  >
                    <Info link={`/permissions/${row?.id}`} />

                    {row?.status !== 'Approved' && (
                      <Delete onClick={() => handleDelete(row?.id)} />
                    )}
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
