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
import { AdsPanelResponse } from '@/types/form';
import { formatDate, formatDateTime } from '@/utils/format-date';

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
      imageUrl:
        'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
      companyEmail: 'shopee@gmail.com',
      companyPhone: '0123456789',
      createdContractDate: '2023-12-08T11:30:53.945Z',
      expiredContractDate: '2024-01-08T11:30:53.945Z',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
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
      imageUrl:
        'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
      companyEmail: 'shopee@gmail.com',
      companyPhone: '0123456789',
      createdContractDate: '2023-12-08T11:30:53.945Z',
      expiredContractDate: '2024-01-08T11:30:53.945Z',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
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
      imageUrl:
        'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
      companyEmail: 'shopee@gmail.com',
      companyPhone: '0123456789',
      createdContractDate: '2023-12-08T11:30:53.945Z',
      expiredContractDate: '2024-01-08T11:30:53.945Z',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
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
      imageUrl:
        'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
      companyEmail: 'shopee@gmail.com',
      companyPhone: '0123456789',
      createdContractDate: '2023-12-08T11:30:53.945Z',
      expiredContractDate: '2024-01-08T11:30:53.945Z',
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
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
      imageUrl:
        'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
      companyEmail: 'shopee@gmail.com',
      companyPhone: '0123456789',
      createdContractDate: '2023-12-08T11:30:53.945Z',
      expiredContractDate: '2024-01-08T11:30:53.945Z',
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
              <TableCell align="center">Loại bảng quảng cáo</TableCell>
              <TableCell align="center">Địa chỉ</TableCell>
              <TableCell align="center">Phường</TableCell>
              <TableCell align="center">Quận</TableCell>
              <TableCell align="center">Chiều rộng</TableCell>
              <TableCell align="center">Chiều dài</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="center">Loại vị trí</TableCell>
              <TableCell align="center">Hình thức quảng cáo</TableCell>
              <TableCell align="center">Hình ảnh</TableCell>
              <TableCell align="center">Email công ty</TableCell>
              <TableCell align="center">Số điện thoại công ty</TableCell>
              <TableCell align="center">Ngày tạo hợp đồng</TableCell>
              <TableCell align="center">Ngày hết hạn hợp đồng</TableCell>
              <TableCell align="center">Thời điểm tạo</TableCell>
              <TableCell align="center">Thời điểm chỉnh sửa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: AdsPanelResponse) => (
              <TableRow key={row?.id}>
                <TableCell align="center">
                  <Link to={`/panels/${row?.id}`}>{row?.id}</Link>
                </TableCell>
                <TableCell align="center">{row?.panelType}</TableCell>
                <TableCell align="center">{row?.address}</TableCell>
                <TableCell align="center">{row?.ward}</TableCell>
                <TableCell align="center">{row?.district}</TableCell>
                <TableCell align="center">{row?.width}</TableCell>
                <TableCell align="center">{row?.height}</TableCell>
                <TableCell align="center">{row?.quantity}</TableCell>
                <TableCell align="center">{row?.positionType}</TableCell>
                <TableCell>{row?.adsType}</TableCell>
                <TableCell align="center">
                  <img
                    src={row?.imageUrl}
                    alt="advertising"
                    style={{ width: '100px', height: '100px' }}
                  />
                </TableCell>
                <TableCell align="center">{row?.companyEmail}</TableCell>
                <TableCell align="center">{row?.companyPhone}</TableCell>
                <TableCell align="center">
                  {formatDate(row?.createdContractDate)}
                </TableCell>
                <TableCell align="center">
                  {formatDate(row?.expiredContractDate)}
                </TableCell>
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
