/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { ModalKey } from '@/constants/modal';
import {
  useLazyGetLocationByIdQuery,
  useLazyGetPanelByIdQuery,
} from '@/store/api/adsManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import {
  useApproveRequestMutation,
  useGetModificationRequestByIdQuery,
  useRejectRequestMutation,
} from '@/store/api/requestManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import { displayTimestamp } from '@/utils/format';
import { showError } from '@/utils/toast';
import CustomLink from '../CustomLink';
import StaticActionBar from '../StaticActionBar';
import LocationCompare from './LocationCompare';
import PanelCompare from './PanelCompare';

const ModificationRequestsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, error } =
    useGetModificationRequestByIdQuery(parseInt(id!));

  const [getLocation, { data: location }] = useLazyGetLocationByIdQuery();
  const [getPanel, { data: panel }] = useLazyGetPanelByIdQuery();
  const [approve] = useApproveRequestMutation();
  const [reject] = useRejectRequestMutation();

  useEffect(() => {
    if (isError) {
      showError(
        isApiErrorResponse(error) && error.status === 404
          ? 'Detail not found'
          : 'Something went wrong',
      );
      navigate('/modification-requests', { replace: true });
    }
  }, [error, isError, navigate]);

  useEffect(() => {
    if (data) {
      if (data.data.targetType === 'Panel' && data.data.panel?.belongPanelId)
        getPanel(data.data.panel?.belongPanelId);
      else if (
        data.data.targetType === 'Location' &&
        data.data.location?.belongLocationId
      )
        getLocation(data.data.location?.belongLocationId);
    }
  }, [data, getLocation, getPanel]);

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
          <Typography>Data modifying target</Typography>
          {data ? (
            <Typography>{data.data.targetType}</Typography>
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
          <Typography>Data compare</Typography>
        </Divider>
        {data ? (
          data.data.targetType === 'Location' ? (
            <LocationCompare
              origin={location?.data}
              modified={data.data.location}
            />
          ) : (
            <PanelCompare origin={panel?.data} modified={data.data.panel} />
          )
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <Fragment />
        )}
      </>
    </StaticActionBar>
  );
};

export default ModificationRequestsDetail;
