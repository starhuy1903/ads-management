import {
  Box,
  ImageList,
  ImageListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { formatDateTime } from '@/utils/format-date';

export default function ReportDetail() {
  const report = {
    id: 5, //
    type: 'Đóng góp ý kiến', //
    fullname: 'Nguyễn Văn A', //
    email: 'nva@gmail.com', //
    phone: '0123456789', //
    content:
      'Bảng quảng cáo đèn quá sáng, gây cảm giác khó chịu cho người dân xung quanh.',
    status: 'Đang xử lý', //
    imageUrls: [
      'https://quangcaongoaitroi.com/wp-content/uploads/2020/06/bien-bang-quang-cao-ngoai-troi-5.jpg',
      'https://quangcaongoaitroi.com/wp-content/uploads/2020/06/bien-bang-quang-cao-ngoai-troi-5.jpg',
    ],
    targetType: 'panel', //
    target: {
      //
      id: 3, //
      panelType: 'Trụ, cụm pano', //
      location: {
        //
        address: 'Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)', //
        ward: 'Bến Nghé', //
        commue: '1', //
        positionType: 'Đất công/Công viên/Hành lang an toàn giao thông', //
        adsType: 'Quảng cáo thương mại', //
      },
      width: 2.5, //
      height: 10, //
      quantity: 1, //
      imageUrl:
        'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png', //
      company: {
        //
        email: 'shopee@gmail.com', //
        phone: '0123456789', //
        createdContractDate: '2023-12-08T11:30:53.945Z', //
        expiredContractDate: '2024-01-08T11:30:53.945Z', //
      },
      createdTime: '2023-12-08T11:30:53.945Z', //
      modifiedTime: '2023-12-08T11:30:53.945Z', //
    },
    resolvedContent: '',
    createdTime: '2023-12-08T11:30:53.945Z', //
    modifiedTime: '2023-12-08T11:30:53.945Z', //
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Chi tiết báo cáo #{report?.id}
      </Typography>
      <Box
        component="form"
        autoComplete="off"
        sx={{
          bgcolor: 'white',
          p: 4,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Stack spacing={2}>
          {/* Thông tin */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Thông tin báo cáo
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="ID"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.id}
            />

            <TextField
              label="Loại báo cáo"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.type}
            />

            <TextField
              label="Đối tượng"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={`${
                report?.targetType === 'panel'
                  ? 'Bảng quảng cáo'
                  : 'Điểm quảng cáo'
              }`}
            />

            <TextField
              label="Thời điểm tạo"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={formatDateTime(report?.createdTime)}
            />

            <TextField
              label="Thời điểm chỉnh sửa"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={formatDateTime(report?.modifiedTime)}
            />

            <TextField
              label="Trạng thái"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.status}
            />
          </Stack>

          {/* Điểm/Bảng quảng cáo */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            {report?.targetType === 'panel'
              ? 'Bảng quảng cáo'
              : 'Điểm quảng cáo'}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="ID"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.target?.id}
            />
            <TextField
              label="Loại bảng quảng cáo"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.target?.panelType}
            />

            <TextField
              label="Chiều rộng"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.target?.width}
            />

            <TextField
              label="Chiều cao"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.target?.height}
            />

            <TextField
              label="Số lượng"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.target?.quantity}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Địa chỉ"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.target?.location?.address}
            />

            <TextField
              label="Phường"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.target?.location?.ward}
            />

            <TextField
              label="Quận"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.target?.location?.commue}
            />

            <TextField
              label="Loại vị trí"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.target?.location?.positionType}
            />

            <TextField
              label="Loại quảng cáo"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.target?.location?.adsType}
            />
          </Stack>

          {/* Người báo cáo */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Thông tin người báo cáo
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Họ và tên"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.fullname}
            />

            <TextField
              label="Email"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.email}
            />

            <TextField
              label="Số điện thoại"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.phone}
            />
          </Stack>
          <TextField
            label="Nội dung báo cáo"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            value={report?.content}
            multiline
            rows={3}
          />

          {/* Hình ảnh báo cáo */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Hình ảnh
          </Typography>
          {report?.imageUrls.length !== 0 ? (
            <ImageList sx={{ width: '70%' }} cols={2}>
              {report?.imageUrls.map((item) => (
                <ImageListItem key={item}>
                  <img src={item} alt="report" loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Typography variant="body1" sx={{ mb: 2 }}>
              Không có hình ảnh
            </Typography>
          )}

          {/* Phản hồi */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Phản hồi
          </Typography>

          {report?.resolvedContent === '' ? (
            <Typography
              variant="body1"
              sx={{ mb: 2, fontStyle: 'italic', color: 'gray' }}
            >
              Chưa có phản hồi.
            </Typography>
          ) : (
            <TextField
              label="Nội dung phản hồi"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={report?.resolvedContent}
              multiline
              rows={3}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
}
