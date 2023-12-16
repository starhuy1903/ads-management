import { Box, Button, IconButton, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function AdDetail() {
  const [data, setData] = useState<AdData | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setData({
        title: 'Trụ cụm pano',
        locationString: 'Đồng Khởi - Nguyễn Du (Sở văn hóa)',
        height: 100,
        width: 100,
        quantity: 1,
        form: 'Cổ động',
        category: 'Đất công viên'
      })
    })
  }, []);

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    )
  };

  return (
    <Box p={2}>
      <Box height={60} />
      <Typography variant="h4" mb={1}>{data.title}</Typography>
      <Typography variant="subtitle1" color="gray">{data.locationString}</Typography>
      <Box mt={3}>
        <Box display="flex">
          <Typography mr={1}>Kich thuoc: </Typography>
          <Typography fontWeight={500}>{`${data.width}m x ${data.height}m`}</Typography> 
        </Box>
        <Box display="flex">
          <Typography mr={1}>Hinh thuc:</Typography>
          <Typography fontWeight={500}>{data.form}</Typography>
        </Box>
        <Box display="flex">
          <Typography mr={1}>Phan loai:</Typography>
          <Typography fontWeight={500}>{data.category}</Typography>
        </Box>
      </Box>
      <Box display='flex' justifyContent="space-between" mt={2}>
        <IconButton>
          <InfoOutlinedIcon color="primary" />
        </IconButton>
        <Button variant="outlined" color="error">Bao cao</Button>
      </Box>
    </Box>
  );
}
