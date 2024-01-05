import EastIcon from '@mui/icons-material/East';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { PanelFull } from '@/types/cdoManagement';
import { displayTimestamp } from '@/utils/format';
import CustomLink from '../CustomLink';

interface PanelCompareProps {
  origin?: PanelFull;
  modified?: PanelFull;
}

const PanelCompare = ({ origin, modified }: PanelCompareProps) => {
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
        <Typography>Width</Typography>
        {origin ? (
          <Typography>{origin.width}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.width}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Height</Typography>
        {origin ? (
          <Typography>{origin.height}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.height}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Location</Typography>
        {origin ? (
          <CustomLink to={'/locations/' + origin.locationId}>
            <Typography>{origin.location.name}</Typography>
          </CustomLink>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <CustomLink to={'/locations/' + modified.locationId}>
            <Typography>{modified.location.name}</Typography>
          </CustomLink>
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
      <>
        <Typography>Contract created date</Typography>
        {origin ? (
          <Typography>{displayTimestamp(origin.createContractDate)}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>
            {displayTimestamp(modified.createContractDate)}
          </Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Contract expire date</Typography>
        {origin ? (
          <Typography>
            {displayTimestamp(origin.expiredContractDate)}
          </Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>
            {displayTimestamp(modified.expiredContractDate)}
          </Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Company email</Typography>
        {origin ? (
          <Typography>{origin.companyEmail}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.companyEmail}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
      <>
        <Typography>Company number</Typography>
        {origin ? (
          <Typography>{origin.companyNumber}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
        {modified ? (
          <Typography>{modified.companyNumber}</Typography>
        ) : (
          <Skeleton variant="text" />
        )}
      </>
    </Box>
  );
};

export default PanelCompare;
