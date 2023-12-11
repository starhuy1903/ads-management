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
      id: '1',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      commue: '1',
      lat: 10.777,
      long: 106.666,
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
      imageUrl:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isPlanning: true,
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: '2',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      commue: '1',
      lat: 10.777,
      long: 106.666,
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
      imageUrl:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isPlanning: true,
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: '3',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      commue: '1',
      lat: 10.777,
      long: 106.666,
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
      imageUrl:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isPlanning: true,
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: '4',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      commue: '1',
      lat: 10.777,
      long: 106.666,
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
      imageUrl:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isPlanning: true,
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    {
      id: '5',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      commue: '1',
      lat: 10.777,
      long: 106.666,
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
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
        Danh sách điểm quảng cáo
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="advertising points">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Địa chỉ</TableCell>
              <TableCell align="center">Phường</TableCell>
              <TableCell align="center">Quận</TableCell>
              <TableCell align="center">Loại vị trí</TableCell>
              <TableCell align="center">Hình thức</TableCell>
              <TableCell align="center">Hình ảnh</TableCell>
              <TableCell align="center">Vĩ độ</TableCell>
              <TableCell align="center">Kinh độ</TableCell>
              <TableCell align="center">Quy hoạch</TableCell>
              <TableCell align="center">Thời điểm tạo</TableCell>
              <TableCell align="center">Thời điểm chỉnh sửa</TableCell>
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
                  row?.isPlanning ? 'Đã quy hoạch' : 'Chưa quy hoạch'
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
