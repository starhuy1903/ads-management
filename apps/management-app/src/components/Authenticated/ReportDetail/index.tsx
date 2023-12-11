import {
  Box,
  ImageList,
  ImageListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DetailTextField } from '@/components/Common/DetailTextField';
import { formatDateTime } from '@/utils/format-date';

export default function ReportDetail() {
  const report = {
    id: 5,
    type: 'Opinion contribution',
    fullname: 'Nguyen Van A',
    email: 'nva@gmail.com',
    phone: '0123456789',
    content:
      'The light of advertising board is too bright, causing discomfort to surrounding people.',
    status: 'Processing',
    imageUrls: [
      'https://quangcaongoaitroi.com/wp-content/uploads/2020/06/bien-bang-quang-cao-ngoai-troi-5.jpg',
      'https://quangcaongoaitroi.com/wp-content/uploads/2020/06/bien-bang-quang-cao-ngoai-troi-5.jpg',
    ],
    targetType: 'panel',
    target: {
      id: 3,
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
    resolvedContent: '',
    createdTime: '2023-12-08T11:30:53.945Z',
    modifiedTime: '2023-12-08T11:30:53.945Z',
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Report Details #{report?.id}
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
          {/* Report information */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Report information
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <DetailTextField label="ID" value={report?.id} />

            <DetailTextField label="Type" value={report?.type} />

            <DetailTextField
              label="Object"
              value={`${report?.targetType === 'panel' ? 'Panel' : 'Location'}`}
            />

            <DetailTextField
              label="Created"
              value={formatDateTime(report?.createdTime)}
            />

            <DetailTextField
              label="Modified"
              value={formatDateTime(report?.modifiedTime)}
            />

            <DetailTextField label="Status" value={report?.status} />
          </Stack>

          {/* Advertising Location/Panel */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            {report?.targetType === 'panel' ? 'Panel' : 'Location'}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <DetailTextField label="ID" value={report?.target?.id} />

            <DetailTextField
              label="Panel type"
              value={report?.target?.panelType}
            />

            <DetailTextField label="Width" value={report?.target?.width} />

            <DetailTextField label="Height" value={report?.target?.height} />

            <DetailTextField
              label="Quantity"
              value={report?.target?.quantity}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <DetailTextField
              label="Address"
              value={report?.target?.location?.address}
            />

            <DetailTextField
              label="Ward"
              value={report?.target?.location?.ward}
            />

            <DetailTextField
              label="District"
              value={report?.target?.location?.commue}
            />

            <DetailTextField
              label="Position type"
              value={report?.target?.location?.positionType}
            />

            <DetailTextField
              label="Advertising type"
              value={report?.target?.location?.adsType}
            />
          </Stack>

          {/* Reporter */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Reporter information
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <DetailTextField label="Full name" value={report?.fullname} />

            <DetailTextField label="Email" value={report?.email} />

            <DetailTextField label="Phone" value={report?.phone} />
          </Stack>
          <TextField
            label="Content"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            value={report?.content}
            multiline
            rows={3}
          />

          {/* Images */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Images
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
            <Typography
              variant="body1"
              sx={{ mb: 2, fontStyle: 'italic', color: 'gray' }}
            >
              No image.
            </Typography>
          )}

          {/* Solution */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Solution
          </Typography>

          {report?.resolvedContent === '' ? (
            <Typography
              variant="body1"
              sx={{ mb: 2, fontStyle: 'italic', color: 'gray' }}
            >
              Not processed yet.
            </Typography>
          ) : (
            <TextField
              label="Response content"
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
