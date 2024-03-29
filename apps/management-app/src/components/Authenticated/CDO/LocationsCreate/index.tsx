import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
import { useCreateLocationMutation } from '@/store/api/cdo/adsManagementApiSlice';
import {
  useLazyGetAdsTypesQuery,
  useLazyGetDistrictsQuery,
  useLazyGetLocationTypesQuery,
  useLazyGetWardsQuery,
} from '@/store/api/cdo/generalManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import { LocationStatus } from '@/types/cdoManagement';
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
  images: yup.array(),
});

const LocationsCreate = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [getDistricts, { data: districts }] = useLazyGetDistrictsQuery();
  const [getWards, { data: wards }] = useLazyGetWardsQuery();
  const [getLocationTypes, { data: locationTypes }] =
    useLazyGetLocationTypesQuery();
  const [getAdsTypes, { data: adsTypes }] = useLazyGetAdsTypesQuery();

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, isLoading },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: async () => {
      const districtsResult = await getDistricts({}, true).unwrap();
      const wardsResult = await getWards({}, true).unwrap();
      const locationTypesResult = await getLocationTypes({}, true).unwrap();
      const adsTypesResult = await getAdsTypes({}, true).unwrap();

      return {
        name: '',
        lat: INITIAL_MAP_CENTER.lat,
        long: INITIAL_MAP_CENTER.lng,
        isPlanning: false,
        districtId: districtsResult.data[0].id,
        wardId:
          wardsResult.data.find(
            (e) => e.districtId === districtsResult.data[0].id,
          )?.id || wardsResult.data[0].id,
        fullAddress: '',
        typeId: locationTypesResult.data[0].id,
        adsTypeId: adsTypesResult.data[0].id,
        images: [],
      };
    },
  });

  const formValue = watch();

  useEffect(() => {
    if (wards)
      setValue(
        'wardId',
        wards.data.find((e) => e.districtId === formValue.districtId)?.id ||
          wards.data[0].id,
        { shouldDirty: true, shouldValidate: true },
      );
  }, [formValue.districtId, setValue, wards]);

  const handleAddImage = useCallback(
    (file: File) => setValue('images', [...formValue.images, file]),
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
      }),
    );
  }, [dispatch, formValue.lat, formValue.long, setValue]);

  const [createLocation] = useCreateLocationMutation();

  const handleCreateLocation = handleSubmit((data: FormData) => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Create new location ?`,
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await createLocation({
              ...data,
              status: LocationStatus.APPROVED,
            }).unwrap();
            reset();
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  });

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
          <Button
            onClick={handleCreateLocation}
            variant="contained"
            disabled={!isDirty || !isValid}
            sx={{ color: (theme) => theme.palette.common.white }}
          >
            Create location
          </Button>
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
          <FormInputSkeleton label="Name" reserveHelperTextSpace />
        ) : (
          <ControlledTextField control={control} name="name" label="Name" />
        )}
        {isLoading ? (
          <FormInputSkeleton label="Is planning" />
        ) : (
          <ControlledCheckbox
            control={control}
            name="isPlanning"
            label="Is planning ?"
          />
        )}
        {isLoading ? (
          <FormInputSkeleton label="Full address" reserveHelperTextSpace />
        ) : (
          <Box sx={{ gridColumn: '1 / span 2' }}>
            <ControlledTextField
              control={control}
              name="fullAddress"
              label="Full address"
            />
          </Box>
        )}
        {isLoading || !districts ? (
          <FormInputSkeleton label="District" />
        ) : (
          <ControlledSelect
            control={control}
            name="districtId"
            label="District"
            options={districts.data.map((e) => ({
              value: e.id,
              label: e.name,
            }))}
          />
        )}
        {isLoading || !wards ? (
          <FormInputSkeleton label="Ward" />
        ) : (
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
        )}
        {isLoading || !locationTypes ? (
          <FormInputSkeleton label="Type" />
        ) : (
          <ControlledSelect
            control={control}
            name="typeId"
            label="Type"
            options={locationTypes.data.map((e) => ({
              value: e.id,
              label: e.name,
            }))}
          />
        )}
        {isLoading || !adsTypes ? (
          <FormInputSkeleton label="Advertisement Type" />
        ) : (
          <ControlledSelect
            control={control}
            name="adsTypeId"
            label="Advertisement Type"
            options={adsTypes.data.map((e) => ({
              value: e.id,
              label: e.name,
            }))}
          />
        )}
        <Box>
          {isLoading ? (
            <>
              <FormInputSkeleton label="Latitude" reserveHelperTextSpace />{' '}
              <FormInputSkeleton label="Longitude" reserveHelperTextSpace />
            </>
          ) : (
            <>
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
            </>
          )}
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
              <FormLabel sx={{ mb: 1 }}>Upload image</FormLabel>
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
      </Box>
    </StaticActionBar>
  );
};

export default LocationsCreate;
