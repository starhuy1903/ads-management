/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch } from '@/store';
import ControlledCheckbox from '@/components/Common/ControlledCheckbox';
import ControlledSelect from '@/components/Common/ControlledSelect';
import ControlledTextField from '@/components/Common/ControlledTextField';
import DropFileContainer from '@/components/Common/DropFileContainer';
import ImagePreview from '@/components/Unauthenticated/Citizen/CitizenReport/ImagePreview';
import UploadImageCard from '@/components/Unauthenticated/Citizen/CitizenReport/UploadImageCard';
import { INITIAL_MAP_CENTER } from '@/constants/app';
import { ModalKey } from '@/constants/modal';
import { ImageFileConfig } from '@/constants/validation';
import {
  useDeleteLocationsMutation,
  useLazyGetLocationByIdQuery,
  useUpdateLocationMutation,
} from '@/store/api/cdo/adsManagementApiSlice';
import {
  useGetAdsTypesQuery,
  useGetDistrictsQuery,
  useGetLocationTypesQuery,
  useGetWardsQuery,
} from '@/store/api/cdo/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showModal } from '@/store/slice/modal';
import { LocationStatus } from '@/types/cdoManagement';
import { showError } from '@/utils/toast';
import FormInputSkeleton from '../FormInputSkeleton';
import StaticActionBar from '../StaticActionBar';

interface FormData {
  name: string;
  lat: number;
  long: number;
  isPlanning: boolean;
  districtId: number;
  wardId: number;
  fullAddress: string;
  typeId: number;
  adsTypeId: number;
  // imageUrls: Array<string>;
  images: Array<File>;
}

const schema = yup.object({
  name: yup.string().required("Location's name is required"),
  lat: yup
    .number()
    .required()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),
  long: yup
    .number()
    .required()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
  isPlanning: yup.boolean(),
  districtId: yup.number().required(),
  wardId: yup.number().required(),
  fullAddress: yup.string().required('Full address is required'),
  typeId: yup.number().required(),
  adsTypeId: yup.number().required(),
  // imageUrls: yup.array(),
  images: yup.array(),
});

const LocationsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [getLocation, { data }] = useLazyGetLocationByIdQuery();
  const { data: districts } = useGetDistrictsQuery({});
  const { data: wards } = useGetWardsQuery({});
  const { data: locationTypes } = useGetLocationTypesQuery({});
  const { data: adsTypes } = useGetAdsTypesQuery({});

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, isLoading },
    setValue,
    reset,
    watch,
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: async () => {
      try {
        const location = await getLocation(parseInt(id!), true).unwrap();
        const images = await Promise.all(
          location.data.imageUrls.map(
            async (e) =>
              await fetch(e)
                .then((res) => res.blob())
                .then((blob) => {
                  return new File([blob], e);
                }),
          ),
        );

        return {
          ...location.data,
          adsTypeId: location.data.adTypeId,
          images,
        };
      } catch (error) {
        showError(
          isApiErrorResponse(error) && error.status === 404
            ? 'Detail not found'
            : 'Something went wrong',
        );
        navigate('/locations', { replace: true });
        return {
          name: '',
          lat: INITIAL_MAP_CENTER.lat,
          long: INITIAL_MAP_CENTER.lng,
          isPlanning: false,
          districtId: 0,
          wardId: 0,
          fullAddress: '',
          typeId: 0,
          adsTypeId: 0,
          images: [],
          // imageUrls: [],
        };
      }
    },
  });

  const formValue = watch();

  useEffect(() => {
    if (wards && isDirty)
      setValue(
        'wardId',
        wards.data.find((e) => e.districtId === formValue.districtId)?.id ||
          wards.data[0].id,
        { shouldDirty: true, shouldValidate: true },
      );
  }, [formValue.districtId, isDirty, setValue, wards]);

  const handleAddImage = useCallback(
    (file: File) =>
      setValue('images', [...formValue.images, file], {
        shouldDirty: true,
        shouldValidate: true,
      }),
    [formValue.images, setValue],
  );

  const handleUploadImage = useCallback(
    (file: File | null) => {
      if (!file) {
        return;
      }

      dispatch(
        showModal(ModalKey.CROP_IMAGE, {
          image: file,
          aspect: 16 / 9,
          onSubmit: handleAddImage,
        }),
      );
    },
    [dispatch, handleAddImage],
  );

  const handleDeleteImage = useCallback(
    (file: File) => {
      setValue(
        'images',
        formValue.images.filter((image) => image !== file),
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    },
    [formValue.images, setValue],
  );

  const renderUpdateImageContainer = ({
    open,
    disabled,
  }: {
    open: () => void;
    disabled: boolean;
  }) => <UploadImageCard open={open} disabled={disabled} />;

  const handlePickCoordinate = useCallback(() => {
    dispatch(
      showModal(ModalKey.COORDINATE_PICKING, {
        initialCoordinate: {
          lat: formValue.lat,
          lng: formValue.long,
        },
        onConfirm: ({ lat, lng }: { lat: number; lng: number }) => {
          setValue('lat', lat, { shouldDirty: true, shouldValidate: true });
          setValue('long', lng, { shouldDirty: true, shouldValidate: true });
          dispatch(showModal(null));
        },
        markerIcon: 'edit',
      }),
    );
  }, [dispatch, formValue.lat, formValue.long, setValue]);

  const [updateLocation] = useUpdateLocationMutation();

  const handleUpdateLocation = handleSubmit((data: FormData) => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Apply changes ?`,
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await updateLocation({
              id: parseInt(id!),
              data: { ...data, status: LocationStatus.APPROVED },
            }).unwrap();
            reset(data);
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  });

  const [deleteLocations] = useDeleteLocationsMutation();

  const handleDeleteLocation = useCallback(async () => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Delete ${data?.data.name} ?`,
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await deleteLocations(parseInt(id!)).unwrap();
            navigate(-1);
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  }, [data?.data.name, deleteLocations, dispatch, id, navigate]);

  return (
    <StaticActionBar
      actionBarAlign="space-between"
      actionBar={
        <>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Box sx={{ display: 'inline-flex', columnGap: '16px' }}>
            <Button
              variant="outlined"
              disabled={!isDirty}
              onClick={() => reset()}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              disabled={!isDirty || !isValid}
              sx={{ color: (theme) => theme.palette.common.white }}
              onClick={handleUpdateLocation}
            >
              Save changes
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteLocation}
            >
              Delete
            </Button>
          </Box>
        </>
      }
    >
      <Box
        component="form"
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: '16px',
          rowGap: '16px',
        }}
      >
        {isLoading ? (
          <>
            <FormInputSkeleton label="Name" reserveHelperTextSpace />
            <FormControlLabel
              label="Is planning ?"
              labelPlacement="end"
              control={<Checkbox disabled />}
              sx={{ width: '100%', userSelect: 'none' }}
            />
            <Box sx={{ gridColumn: '1 / span 2' }}>
              <FormInputSkeleton label="Full address" reserveHelperTextSpace />
            </Box>
            <FormInputSkeleton label="District" />
            <FormInputSkeleton label="Ward" />
            <FormInputSkeleton label="Type" />
            <FormInputSkeleton label="Advertisement type" />
            <Box>
              <FormInputSkeleton label="Latitude" reserveHelperTextSpace />
              <FormInputSkeleton label="Longitude" reserveHelperTextSpace />
            </Box>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button variant="contained" disabled>
                Pick Coordinate
              </Button>
            </Box>
          </>
        ) : (
          <>
            <ControlledTextField control={control} name="name" label="Name" />
            <ControlledCheckbox
              control={control}
              name="isPlanning"
              label="Is planning ?"
            />
            <Box sx={{ gridColumn: '1 / span 2' }}>
              <ControlledTextField
                control={control}
                name="fullAddress"
                label="Full address"
              />
            </Box>
            {districts ? (
              <ControlledSelect
                control={control}
                name="districtId"
                label="District"
                options={districts.data.map((e) => ({
                  value: e.id,
                  label: e.name,
                }))}
              />
            ) : (
              <FormInputSkeleton label="District" />
            )}
            {wards ? (
              <ControlledSelect
                control={control}
                name="wardId"
                label="Ward"
                options={wards.data
                  .filter((e) => e.districtId === formValue.districtId)
                  .map((e) => ({
                    value: e.id,
                    label: e.name,
                  }))}
              />
            ) : (
              <FormInputSkeleton label="Ward" />
            )}
            {locationTypes ? (
              <ControlledSelect
                control={control}
                name="typeId"
                label="Type"
                options={locationTypes.data.map((e) => ({
                  value: e.id,
                  label: e.name,
                }))}
              />
            ) : (
              <FormInputSkeleton label="Type" />
            )}
            {adsTypes ? (
              <ControlledSelect
                control={control}
                name="adTypeId"
                label="Advertisement Type"
                options={adsTypes.data.map((e) => ({
                  value: e.id,
                  label: e.name,
                }))}
              />
            ) : (
              <FormInputSkeleton label="Advertisement type" />
            )}
            <Box>
              <ControlledTextField
                control={control}
                name="lat"
                label="Latitude"
              />
              <ControlledTextField
                control={control}
                name="long"
                label="Longitude"
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                variant="contained"
                sx={{ color: 'common.white' }}
                onClick={handlePickCoordinate}
              >
                Pick coordinate
              </Button>
            </Box>
            <Box sx={{ gridColumn: '1 / span 2' }}>
              {isLoading ? (
                <Skeleton variant="rounded" />
              ) : (
                <FormControl>
                  <FormLabel sx={{ mb: 1 }}>Image</FormLabel>
                  <Stack direction="row" spacing={2}>
                    {formValue.images.map((image, index) => (
                      <ImagePreview
                        key={index}
                        image={image}
                        disabled={isLoading}
                        onDeleteImage={handleDeleteImage}
                      />
                    ))}
                    {formValue.images.length < 2 && (
                      <DropFileContainer
                        onDropFile={handleUploadImage}
                        acceptMIMETypes={ImageFileConfig.ACCEPTED_MINE_TYPES}
                        renderChildren={renderUpdateImageContainer}
                        disabled={isLoading}
                        maxSize={ImageFileConfig.MAX_SIZE}
                      />
                    )}
                  </Stack>
                </FormControl>
              )}
            </Box>
          </>
        )}
      </Box>
    </StaticActionBar>
  );
};

export default LocationsDetail;
