import { DevTool } from '@hookform/devtools';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { BackButton } from '@/components/Common/Buttons';
import { showSuccess } from '@/utils/toast';

const report = {
  id: 5,
  type: 'Opinion contribution',
  fullname: 'Nguyen Van A',
  email: 'nva@gmail.com',
  phone: '0123456789',
  content:
    'The light of advertising board is too bright, causing discomfort to surrounding people.',
  status: 'New',
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
  resolvedContent:
    'Sorry for the above issue, we are currently trying to contact the company to discuss your report. Please wait, we will process and fix it as soon as possible.',
  createdTime: '2023-12-08T11:30:53.945Z',
  modifiedTime: '2023-12-08T11:30:53.945Z',
};

const Statuses = ['Processing', 'Resolved'];

interface ReportResponseForm {
  status: string;
  resolvedContent: string;
}

export default function ReportResponse() {
  const { handleSubmit, register, formState, control } =
    useForm<ReportResponseForm>({
      mode: 'onChange',
      defaultValues: {
        status: report?.status,
        resolvedContent: report?.resolvedContent,
      },
    });

  const { errors: formError } = formState;

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (data: ReportResponseForm) => {
    setSubmitting(true);
    console.log(data);
    setSubmitting(false);
    showSuccess('Send response successfully!');
  };

  return (
    <Box>
      <BackButton />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ my: 2 }}>
          Respond to Report #{report?.id}
        </Typography>

        <Button
          startIcon={<InfoIcon />}
          variant="contained"
          component={Link}
          to={`/reports/${report?.id}`}
          sx={{
            color: 'white',
          }}
        >
          Report Detail
        </Button>
      </Box>
      <Box
        component="form"
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'white',
          p: 4,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <FormControl fullWidth error={!!formError.status}>
          <FormLabel htmlFor="status">Status</FormLabel>
          <Select
            id="status"
            {...register('status')}
            aria-describedby="status-helper-text"
            defaultValue={
              report?.status === 'New' ? 'Processing' : report?.status
            }
          >
            {Statuses.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText id="status-helper-text">
            {formError.status?.message}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth error={!!formError.resolvedContent}>
          <FormLabel htmlFor="resolvedContent">Solution</FormLabel>
          <TextField
            {...register('resolvedContent', {
              required: 'The solution is required.',
            })}
            id="resolvedContent"
            error={!!formError.resolvedContent}
            aria-describedby="resolvedContent-helper-text"
            multiline
            rows={7}
          />
          <FormHelperText id="resolvedContent-helper-text">
            {formError.resolvedContent?.message}
          </FormHelperText>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          disabled={submitting}
          onClick={handleSubmit(onSubmit)}
          sx={{ color: 'white' }}
        >
          Send response
        </Button>

        <DevTool control={control} />
      </Box>
    </Box>
  );
}
