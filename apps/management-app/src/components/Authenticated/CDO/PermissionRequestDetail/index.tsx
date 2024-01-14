/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { ModalKey } from '@/constants/modal';
import { isApiErrorResponse } from '@/store/api/helper';
import {
  useApproveRequestMutation,
  useGetPermissionRequestByIdQuery,
  useRejectRequestMutation,
} from '@/store/api/cdo/requestManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import { displayTimestamp } from '@/utils/format';
import { showError } from '@/utils/toast';
import CustomLink from '../CustomLink';
import StaticActionBar from '../StaticActionBar';

const PermissionRequestsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, error } = useGetPermissionRequestByIdQuery(
    parseInt(id!),
  );

  const [approve] = useApproveRequestMutation();
  const [reject] = useRejectRequestMutation();

  useEffect(() => {
    if (isError) {
      showError(
        isApiErrorResponse(error) && error.status === 404
          ? 'Detail not found'
          : 'Something went wrong',
      );
      navigate('/permission-requests', { replace: true });
    }
  }, [error, isError, navigate]);

  return (
    <StaticActionBar
      actionBarAlign="flex-start"
      actionBar={
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      }
      actionBarBottom={
        <>
          <Button
            type="button"
            variant="contained"
            color="success"
            disabled={isLoading}
            onClick={() =>
              dispatch(
                showModal(ModalKey.GENERAL, {
                  headerText: `Approve request ?`,
                  primaryButtonText: 'Confirm',
                  onClickPrimaryButton: async () => {
                    try {
                      dispatch(showModal(null));
                      await approve(data!.data.id).unwrap();
                      navigate(-1);
                    } catch (error) {
                      /* empty */
                    }
                  },
                }),
              )
            }
          >
            Approve
          </Button>
          <Button
            type="button"
            variant="contained"
            color="error"
            disabled={isLoading}
            onClick={() =>
              dispatch(
                showModal(ModalKey.GENERAL, {
                  headerText: `Reject request ?`,
                  primaryButtonText: 'Confirm',
                  onClickPrimaryButton: async () => {
                    try {
                      dispatch(showModal(null));
                      await reject(data!.data.id).unwrap();
                      navigate(-1);
                    } catch (error) {
                      /* empty */
                    }
                  },
                }),
              )
            }
          >
            Reject
          </Button>
        </>
      }
    >
      <>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 3fr',
            gap: '16px',
            fontSize: '1rem',
            padding: '16px',
          }}
        >
          <Typography>ID</Typography>
          {data ? (
            <Typography>{data.data.id}</Typography>
          ) : (
            <Skeleton variant="text" />
          )}
          <Typography>Reason</Typography>
          {data ? (
            <Typography>{data.data.reason}</Typography>
          ) : (
            <Skeleton variant="text" />
          )}
          <Typography>Created at</Typography>
          {data ? (
            <Typography>{displayTimestamp(data.data.createdAt)}</Typography>
          ) : (
            <Skeleton variant="text" />
          )}
          <Typography>Last updated at</Typography>
          {data ? (
            <Typography>{displayTimestamp(data.data.updatedAt)}</Typography>
          ) : (
            <Skeleton variant="text" />
          )}
          <Typography>Author</Typography>
          {data ? (
            <CustomLink to={'/accounts/' + data.data.userId}>
              <Typography
                sx={{ display: 'inline' }}
              >{`${data.data.user.firstName} ${data.data.user.lastName}`}</Typography>
            </CustomLink>
          ) : (
            <Skeleton variant="text" />
          )}
        </Box>
        <Divider sx={{ margin: '20px 0' }}>
          <Typography>Panel data</Typography>
        </Divider>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 3fr',
            gap: '20px',
            padding: '16px',
          }}
        >
          <Typography>Type</Typography>
          {data ? (
            <Typography>{data.data.panel?.type.name}</Typography>
          ) : (
            <Skeleton variant="text" />
          )}
          <Typography>Width</Typography>
          {data ? (
            <Typography>{data.data.panel?.width + 'm'}</Typography>
          ) : (
            <Skeleton variant="text" />
          )}
          <Typography>Height</Typography>
          {data ? (
            <Typography>{data.data.panel?.height + 'm'}</Typography>
          ) : (
            <Skeleton variant="text" />
          )}
          <Typography>Location</Typography>
          {data ? (
            <CustomLink to={'/locations/' + data.data.panel?.locationId}>
              <Typography>{data.data.panel?.location.name}</Typography>
            </CustomLink>
          ) : (
            <Skeleton variant="text" />
          )}
          <Typography>Images</Typography>
          {data && data.data.panel ? (
            data.data.panel.imageUrls.length > 0 ? (
              data.data.panel.imageUrls.map((e) => (
                <img
                  key={e}
                  src={e}
                  alt="alt"
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    borderRadius: '10px',
                  }}
                />
              ))
            ) : (
              <Typography>None</Typography>
            )
          ) : (
            <Skeleton
              variant="rounded"
              sx={{ width: '100%', maxWidth: '300px', borderRadius: '10px' }}
            />
          )}
          <Typography>Contract created date</Typography>
          {data && data.data.panel ? (
            <Typography>
              {displayTimestamp(data.data.panel.createContractDate)}
            </Typography>
          ) : (
            <Skeleton variant="text" />
          )}
          <Typography>Contract expire date</Typography>
          {data && data.data.panel ? (
            <Typography>
              {displayTimestamp(data.data.panel.expiredContractDate)}
            </Typography>
          ) : (
            <Skeleton variant="text" />
          )}
          <Typography>Company email</Typography>
          {data && data.data.panel ? (
            <Typography>{data.data.panel.companyEmail}</Typography>
          ) : (
            <Skeleton variant="text" />
          )}
          <Typography>Company number</Typography>
          {data && data.data.panel ? (
            <Typography>{data.data.panel.companyNumber}</Typography>
          ) : (
            <Skeleton variant="text" />
          )}
        </Box>
      </>
    </StaticActionBar>
  );
};

export default PermissionRequestsDetail;
