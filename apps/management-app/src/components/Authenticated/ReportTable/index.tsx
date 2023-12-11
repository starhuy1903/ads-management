import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ReportResponse } from '@/types/form';
import { formatDateTime } from '@/utils/format-date';

export default function ReportTable() {
  const rows: ReportResponse[] = [
    {
      id: '1',
      reportType: 'Đóng góp ý kiến',
      sentAt: '2023-12-08T11:30:53.945Z',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      name: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
    },
    {
      id: '2',
      reportType: 'Đóng góp ý kiến',
      sentAt: '2023-12-08T11:30:53.945Z',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      name: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
    },
    {
      id: '3',
      reportType: 'Đóng góp ý kiến',
      sentAt: '2023-12-08T11:30:53.945Z',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      name: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
    },
    {
      id: '4',
      reportType: 'Đóng góp ý kiến',
      sentAt: '2023-12-08T11:30:53.945Z',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      name: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
    },
    {
      id: '5',
      reportType: 'Đóng góp ý kiến',
      sentAt: '2023-12-08T11:30:53.945Z',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      name: 'Nguyễn Văn A',
      email: 'nva@gmail.com',
      phone: '0123456789',
      content:
        'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="advertising points">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Hình thức</TableCell>
            <TableCell align="center">Thời điểm gửi</TableCell>
            <TableCell align="center">Địa chỉ</TableCell>
            <TableCell align="center">Phường</TableCell>
            <TableCell align="center">Quận</TableCell>
            <TableCell align="center">Người gửi</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Số điện thoại</TableCell>
            <TableCell align="center">Nội dung</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: ReportResponse) => (
            <TableRow key={row.id}>
              <TableCell align="center">{row?.id}</TableCell>
              <TableCell align="center">{row?.reportType}</TableCell>
              <TableCell align="center">
                {formatDateTime(row?.sentAt)}
              </TableCell>
              <TableCell align="center">{row?.address}</TableCell>
              <TableCell align="center">{row?.ward}</TableCell>
              <TableCell align="center">{row?.district}</TableCell>
              <TableCell align="center">{row?.name}</TableCell>
              <TableCell align="center">{row?.email}</TableCell>
              <TableCell align="center">{row?.phone}</TableCell>
              <TableCell>{row?.content}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
