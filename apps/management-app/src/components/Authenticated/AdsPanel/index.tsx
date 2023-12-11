import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { AdsPanelResponse } from '@/types/form';

export default function AdsPanel() {
  const rows: AdsPanelResponse[] = [
    {
      id: '1',
      panelType: 'Trụ, cụm pano',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      width: 2.5,
      height: 10,
      quantity: 1,
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
    },
    {
      id: '2',
      panelType: 'Trụ, cụm pano',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      width: 2.5,
      height: 10,
      quantity: 1,
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
    },
    {
      id: '3',
      panelType: 'Trụ, cụm pano',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      width: 2.5,
      height: 10,
      quantity: 1,
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
    },
    {
      id: '4',
      panelType: 'Trụ, cụm pano',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      width: 2.5,
      height: 10,
      quantity: 1,
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
    },
    {
      id: '5',
      panelType: 'Trụ, cụm pano',
      address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)',
      ward: 'Bến Nghé',
      district: '1',
      width: 2.5,
      height: 10,
      quantity: 1,
      positionType: 'Đất công/Công viên/Hành lang an toàn giao thông',
      adsType: 'Quảng cáo thương mại',
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="advertising points">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Loại bảng quảng cáo</TableCell>
            <TableCell align="center">Địa chỉ</TableCell>
            <TableCell align="center">Phường</TableCell>
            <TableCell align="center">Quận</TableCell>
            <TableCell align="center">Chiều rộng</TableCell>
            <TableCell align="center">Chiều dài</TableCell>
            <TableCell align="center">Số lượng</TableCell>
            <TableCell align="center">Loại vị trí</TableCell>
            <TableCell align="center">Hình thức quảng cáo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: AdsPanelResponse) => (
            <TableRow key={row.id}>
              <TableCell align="center">{row?.id}</TableCell>
              <TableCell align="center">{row?.panelType}</TableCell>
              <TableCell align="center">{row?.address}</TableCell>
              <TableCell align="center">{row?.ward}</TableCell>
              <TableCell align="center">{row?.district}</TableCell>
              <TableCell align="center">{row?.width}</TableCell>
              <TableCell align="center">{row?.height}</TableCell>
              <TableCell align="center">{row?.quantity}</TableCell>
              <TableCell align="center">{row?.positionType}</TableCell>
              <TableCell>{row?.adsType}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
