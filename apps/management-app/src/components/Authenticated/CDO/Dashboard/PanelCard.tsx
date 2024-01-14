import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Stack,
  Typography,
} from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel } from '@/types/panel';
import { CreatedReport } from '@/types/report';
import { formatDate } from '@/utils/datetime';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface PanelCardProps {
  data: Panel;
  violatedReports?: CreatedReport[];
}

export default function PanelCard({
  data,
  violatedReports = [],
}: PanelCardProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card raised sx={{ background: 'rgb(224 242 254)' }}>
      <CardHeader
        title={data.type.name}
        subheader={data.location.fullAddress}
      />
      <CardContent>
        <Typography>
          Size:{' '}
          <Typography
            component="span"
            fontWeight={500}
          >{`${data.width}m x ${data.height}m`}</Typography>
        </Typography>

        <Typography>
          Advertisment type:{' '}
          <Typography component="span" fontWeight={500}>
            {data.location.adType.name}
          </Typography>
        </Typography>

        <Typography>
          Panel type:{' '}
          <Typography component="span" fontWeight={500}>
            {data.location.type.name}
          </Typography>
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/panels/' + data.id)}
        >
          View panel
        </Button>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>
            Contract expire on:{' '}
            <Typography component="span" fontWeight={500}>
              {formatDate(data.expiredContractDate)}
            </Typography>
          </Typography>
          <Stack spacing={2} marginTop={2}>
            {data.imageUrls.map((imageUrl) => (
              <CardMedia
                key={imageUrl}
                component="img"
                height="194"
                image={imageUrl}
                alt="Paella dish"
              />
            ))}
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
}
