import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Location } from '@/types/cdoManagement';

interface LocationCompareProps {
  origin?: Location;
  modified?: Location;
}

const LocationCompare = ({ origin, modified }: LocationCompareProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 2fr',
        gap: '20px',
        padding: '16px',
      }}
    >
      <Box
        sx={{
          gridColumn: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography fontWeight="bold">Original version</Typography>
        <EastIcon />
      </Box>
      <Typography fontWeight="bold">Modified version</Typography>
      <>
        <Typography>Latitude</Typography>
        {origin ? (
          <Typography>{origin.lat}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.lat}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Longitude</Typography>
        {origin ? (
          <Typography>{origin.long}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.long}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Is planning ?</Typography>
        {origin ? (
          origin.isPlanning ? (
            <CheckIcon />
          ) : (
            <CloseIcon />
          )
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          modified.isPlanning ? (
            <CheckIcon />
          ) : (
            <CloseIcon />
          )
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Name</Typography>
        {origin ? (
          <Typography>{origin.name}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.name}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>District</Typography>
        {origin ? (
          <Typography>{origin.district.name}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.district.name}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Ward</Typography>
        {origin ? (
          <Typography>{origin.ward.name}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.ward.name}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Full address</Typography>
        {origin ? (
          <Typography>{origin.fullAddress}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.fullAddress}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Type</Typography>
        {origin ? (
          <Typography>{origin.type.name}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.type.name}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Advertisement type</Typography>
        {origin ? (
          <Typography>{origin.adType.name}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.adType.name}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Images</Typography>
        {origin ? (
          origin.imageUrls.length > 0 ? (
            origin.imageUrls.map((e) => (
              <img
                key={e}
                src={e}
                alt="alt"
                style={{ width: '100%', borderRadius: '10px' }}
              />
            ))
          ) : (
            <Typography>None</Typography>
          )
        ) : (
          <Skeleton
            variant="rounded"
            sx={{ width: '100%', borderRadius: '10px' }}
          />
        )}
        {modified ? (
          modified.imageUrls.length > 0 ? (
            modified.imageUrls.map((e) => (
              <img
                key={e}
                src={e}
                alt="alt"
                style={{ width: '100%', borderRadius: '10px' }}
              />
            ))
          ) : (
            <Typography>None</Typography>
          )
        ) : (
          <Skeleton
            variant="rounded"
            sx={{ width: '100%', borderRadius: '10px' }}
          />
        )}
      </>
    </Box>
  );
};

export default LocationCompare;
