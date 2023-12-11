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
      type: 'Đóng góp ý kiến',
      fullname: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
      status: 'Đang xử lý',
      imageUrls: [],
      targetType: 'panel',
      target: {
        id: 3,
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
      resolvedContent: '',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 2,
      type: 'Đóng góp ý kiến',
      fullname: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
      status: 'Đang xử lý',
      imageUrls: [],
      targetType: 'panel',
      target: {
        id: 3,
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
      resolvedContent: '',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 3,
      type: 'Đóng góp ý kiến',
      fullname: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
      status: 'Đang xử lý',
      imageUrls: [],
      targetType: 'panel',
      target: {
        id: 3,
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
      resolvedContent: '',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 4,
      type: 'Đóng góp ý kiến',
      fullname: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
      status: 'Đang xử lý',
      imageUrls: [],
      targetType: 'panel',
      target: {
        id: 3,
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
      resolvedContent: '',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: 5,
      type: 'Đóng góp ý kiến',
      fullname: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
      status: 'Đang xử lý',
      imageUrls: [],
      targetType: 'panel',
      target: {
        id: 3,
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
      resolvedContent: '',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Danh sách bảng quảng cáo
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="advertising points">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Hình thức</TableCell>
              <TableCell align="center">Người gửi</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Số điện thoại</TableCell>
              <TableCell align="center">Nội dung</TableCell>
              <TableCell align="center">Thời điểm tạo</TableCell>
              <TableCell align="center">Thời điểm chỉnh sửa</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
