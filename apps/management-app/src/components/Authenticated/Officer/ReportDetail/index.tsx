import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { BackButton } from '@/components/Common/Buttons';
import { ReadOnlyTextField } from '@/components/Common/FormComponents';
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
      panelType: 'Pillar/Panel cluster',
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
        createdContractDate: '2023-12-01',
        expiredContractDate: '2024-01-01',
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
      <BackButton />
      <Typography variant="h4" sx={{ my: 2 }}>
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
            <ReadOnlyTextField label="ID" value={report?.id} />

            <ReadOnlyTextField label="Type" value={report?.type} />

            <ReadOnlyTextField
              label="Object"
              value={`${report?.targetType === 'panel' ? 'Panel' : 'Location'}`}
            />

            <ReadOnlyTextField
              label="Created"
              value={formatDateTime(report?.createdTime)}
            />

            <ReadOnlyTextField
              label="Modified"
              value={formatDateTime(report?.modifiedTime)}
            />

            <ReadOnlyTextField label="Status" value={report?.status} />
          </Stack>

          {/* Advertising Location/Panel */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            {report?.targetType === 'panel' ? 'Panel' : 'Location'}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <ReadOnlyTextField label="ID" value={report?.target?.id} />

            <ReadOnlyTextField
              label="Panel type"
              value={report?.target?.panelType}
            />

            <ReadOnlyTextField label="Width" value={report?.target?.width} />

            <ReadOnlyTextField label="Height" value={report?.target?.height} />

            <ReadOnlyTextField
              label="Quantity"
              value={report?.target?.quantity}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <ReadOnlyTextField
              label="Address"
              value={report?.target?.location?.address}
            />

            <ReadOnlyTextField
              label="Ward"
              value={report?.target?.location?.ward}
            />

            <ReadOnlyTextField
              label="District"
              value={report?.target?.location?.commue}
            />

            <ReadOnlyTextField
              label="Position type"
              value={report?.target?.location?.positionType}
            />

            <ReadOnlyTextField
              label="Advertising type"
              value={report?.target?.location?.adsType}
            />
          </Stack>

          {/* Reporter */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Reporter information
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <ReadOnlyTextField label="Full name" value={report?.fullname} />

            <ReadOnlyTextField label="Email" value={report?.email} />

            <ReadOnlyTextField label="Phone" value={report?.phone} />
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
            <>
              <Typography
                variant="body1"
                sx={{ mb: 2, fontStyle: 'italic', color: 'gray' }}
              >
                Not processed yet.
              </Typography>

              <Link to={`/reports/${report?.id}/response`}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, color: 'white' }}
                >
                  Respond to report
                </Button>
              </Link>
            </>
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
