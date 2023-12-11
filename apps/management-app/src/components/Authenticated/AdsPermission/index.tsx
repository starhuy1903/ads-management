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
import { AdsPermissionResponse } from '@/types/form';
import { formatDate, formatDateTime } from '@/utils/format-date';

export default function AdsPermission() {
  const rows: AdsPermissionResponse[] = [
    {
      id: 1,
      type: 'Cấp phép bảng quảng cáo',
      panel: {
        id: 2,
        panelType: 'Trụ, cụm pano',
        location: {
          address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
          ward: 'Bến Nghé',
          commue: '1',
          positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
          adsType: 'Quảng cáo thương mại',
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
      reason: 'Quảng cáo sản phẩm dịch vụ cho công ty',
      status: 'Đã duyệt',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 2,
      type: 'Cấp phép bảng quảng cáo',
      panel: {
        id: 2,
        panelType: 'Trụ, cụm pano',
        location: {
          address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
          ward: 'Bến Nghé',
          commue: '1',
          positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
          adsType: 'Quảng cáo thương mại',
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
      reason: 'Quảng cáo sản phẩm dịch vụ cho công ty',
      status: 'Đã duyệt',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 3,
      type: 'Cấp phép bảng quảng cáo',
      panel: {
        id: 2,
        panelType: 'Trụ, cụm pano',
        location: {
          address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
          ward: 'Bến Nghé',
          commue: '1',
          positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
          adsType: 'Quảng cáo thương mại',
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
      reason: 'Quảng cáo sản phẩm dịch vụ cho công ty',
      status: 'Đã duyệt',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 4,
      type: 'Cấp phép bảng quảng cáo',
      panel: {
        id: 2,
        panelType: 'Trụ, cụm pano',
        location: {
          address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
          ward: 'Bến Nghé',
          commue: '1',
          positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
          adsType: 'Quảng cáo thương mại',
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
      reason: 'Quảng cáo sản phẩm dịch vụ cho công ty',
      status: 'Đã duyệt',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 5,
      type: 'Cấp phép bảng quảng cáo',
      panel: {
        id: 2,
        panelType: 'Trụ, cụm pano',
        location: {
          address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
          ward: 'Bến Nghé',
          commue: '1',
          positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
          adsType: 'Quảng cáo thương mại',
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
      reason: 'Quảng cáo sản phẩm dịch vụ cho công ty',
      status: 'Đã duyệt',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Danh sách cấp phép bảng quảng cáo
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="advertising points">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Loại cấp phép</TableCell>
              <TableCell align="center">Loại bảng quảng cáo</TableCell>
              <TableCell align="center">Địa chỉ</TableCell>
              <TableCell align="center">Phường</TableCell>
              <TableCell align="center">Quận</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Thời điểm tạo</TableCell>
              <TableCell align="center">Thời điểm chỉnh sửa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: AdsPermissionResponse) => (
              <TableRow key={row?.id}>
                <TableCell align="center">
                  <Link to={`/panels/${row?.id}`}>{row?.id}</Link>
                </TableCell>
                <TableCell align="center">{row?.type}</TableCell>
                <TableCell align="center">{row?.panel?.panelType}</TableCell>
                <TableCell align="center">
                  {row?.panel?.location?.address}
                </TableCell>
                <TableCell align="center">
                  {row?.panel?.location?.ward}
                </TableCell>
                <TableCell align="center">
                  {row?.panel?.location?.commue}
                </TableCell>
                <TableCell align="center">{row?.reason}</TableCell>
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
