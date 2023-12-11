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
      id: '1',
      type: 'Đóng góp ý kiến',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      fullname: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
      resolvedContent: '',
      status: 'Đang xử lý',
      imageUrls: [],
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: '2',
      type: 'Đóng góp ý kiến',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      fullname: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
      resolvedContent: '',
      status: 'Đang xử lý',
      imageUrls: [],
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: '3',
      type: 'Đóng góp ý kiến',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      fullname: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
      resolvedContent: '',
      status: 'Đang xử lý',
      imageUrls: [],
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: '4',
      type: 'Đóng góp ý kiến',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      fullname: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
      resolvedContent: '',
      status: 'Đang xử lý',
      imageUrls: [],
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: '5',
      type: 'Đóng góp ý kiến',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      fullname: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
      resolvedContent: '',
      status: 'Đang xử lý',
      imageUrls: [],
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
              <TableCell align="center">Địa chỉ</TableCell>
              <TableCell align="center">Phường</TableCell>
              <TableCell align="center">Quận</TableCell>
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
                <TableCell align="center">{row?.address}</TableCell>
                <TableCell align="center">{row?.ward}</TableCell>
                <TableCell align="center">{row?.district}</TableCell>
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
