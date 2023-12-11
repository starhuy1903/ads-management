import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { AdsLocationResponse } from '@/types/form';

export default function AdsLocation() {
  const rows: AdsLocationResponse[] = [
    {
      id: '1',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
      image:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isZoning: 'Đã quy hoạch',
    },
    {
      id: '2',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
      image:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isZoning: 'Đã quy hoạch',
    },
    {
      id: '3',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
      image:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isZoning: 'Đã quy hoạch',
    },
    {
      id: '4',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
      image:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isZoning: 'Đã quy hoạch',
    },
    {
      id: '5',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
      image:
        'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
      isZoning: 'Đã quy hoạch',
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="advertising points">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Địa chỉ</TableCell>
            <TableCell align="center">Phường</TableCell>
            <TableCell align="center">Quận</TableCell>
            <TableCell align="center">Loại vị trí</TableCell>
            <TableCell align="center">Hình thức quảng cáo</TableCell>
            <TableCell align="center">
              Hình ảnh điểm đặt bảng quảng cáo
            </TableCell>
            <TableCell align="center">Thông tin quy hoạch</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: AdsLocationResponse) => (
            <TableRow key={row.id}>
              <TableCell align="center">{row?.id}</TableCell>
              <TableCell align="center">{row?.address}</TableCell>
              <TableCell align="center">{row?.ward}</TableCell>
              <TableCell align="center">{row?.district}</TableCell>
              <TableCell align="center">{row?.positionType}</TableCell>
              <TableCell align="center">{row?.adsType}</TableCell>
              <TableCell
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img src={row?.image} alt="advertising point" width={120} />
              </TableCell>
              <TableCell align="center">{row?.isZoning}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
