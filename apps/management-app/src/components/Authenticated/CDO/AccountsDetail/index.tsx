import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch } from '@/store';
import ControlledDatePicker from '@/components/Common/ControlledDatePicker';
import ControlledSelect from '@/components/Common/ControlledSelect';
import ControlledTextField from '@/components/Common/ControlledTextField';
import { ModalKey } from '@/constants/modal';
import {
  useLazyGetAccountByIdQuery,
  useUpdateAccountMutation,
} from '@/store/api/cdo/accountManagementApiSlice';
import {
  useGetDistrictsQuery,
  useGetWardsQuery,
} from '@/store/api/cdo/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showModal } from '@/store/slice/modal';
import { AccountRole } from '@/types/cdoManagement';
import { showError } from '@/utils/toast';
import FormInputSkeleton from '../FormInputSkeleton';
import StaticActionBar from '../StaticActionBar';

dayjs.extend(utc);

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  dob?: dayjs.Dayjs;
  phoneNumber?: string;
  role: AccountRole;
  wardId: number;
  districtId: number;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter valid email')
    .required("User's email is required"),
  firstName: yup.string().required("User's first name is required"),
  lastName: yup.string().required("User's last name is required"),
  role: yup.string().required("User's role is required"),
  dob: yup.string().optional(),
  phoneNumber: yup.string().optional(),
  wardId: yup.number().optional(),
  districtId: yup.number().optional(),
});

const AccountsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [getAccount] = useLazyGetAccountByIdQuery();
  const { data: districts } = useGetDistrictsQuery({});
  const { data: wards } = useGetWardsQuery({});

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
      try {
        const account = await getAccount(parseInt(id!)).unwrap();

        return {
          ...account,
          dob: account.dob ? dayjs.utc(account.dob) : undefined,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          districtId: account.district?.id || account.ward?.district.id || -1,
          wardId: account.ward?.id || -1,
        };
      } catch (error) {
        showError(
          isApiErrorResponse(error) && error.status === 404
            ? 'Detail not found'
            : 'Something went wrong',
        );
        navigate('/accounts', { replace: true });
        return {
          email: '',
          firstName: '',
          lastName: '',
          role: AccountRole.CDO,
          districtId: -1,
          wardId: -1,
        };
      }
    },
  });

  const formValue = watch();

  useEffect(() => {
    switch (formValue.role) {
      case AccountRole.CDO: {
        setValue('districtId', -1, { shouldDirty: true, shouldValidate: true });
        setValue('wardId', -1, { shouldDirty: true, shouldValidate: true });
        break;
      }
      case AccountRole.DISTRICT_OFFICER: {
        if (districts) {
          setValue('districtId', districts.data[0].id);
        }
        setValue('wardId', -1, { shouldDirty: true, shouldValidate: true });
        break;
      }
      case AccountRole.WARD_OFFICER: {
        if (districts && formValue.districtId === -1) {
          setValue('districtId', districts.data[0].id);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districts, formValue.role, setValue]);

  useEffect(() => {
    if (
      wards &&
      formValue.districtId !== -1 &&
      formValue.role === AccountRole.WARD_OFFICER &&
      formValue.wardId === -1
    )
      setValue(
        'wardId',
        wards.data.find((e) => e.districtId === formValue.districtId)?.id ||
          wards.data[0].id,
        { shouldDirty: true, shouldValidate: true },
      );
  }, [formValue.districtId, formValue.role, formValue.wardId, setValue, wards]);

  const [updateAccount] = useUpdateAccountMutation();

  const handleUpdateAccount = handleSubmit((data: FormData) => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Apply changes ?`,
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await updateAccount({
              id: parseInt(id!),
              data: {
                ...data,
                districtId:
                  data.districtId !== -1 &&
                  data.role !== AccountRole.WARD_OFFICER
                    ? data.districtId
                    : undefined,
                wardId: data.wardId !== -1 ? data.wardId : undefined,
                dob: data.dob ? dayjs.utc(data.dob).format() : undefined,
              },
            }).unwrap();
            reset({ ...data, dob: data.dob ? dayjs.utc(data.dob) : undefined });
          } catch (error) {
            console.log(error);
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
              onClick={handleUpdateAccount}
            >
              Save changes
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
            <FormInputSkeleton label="Email" reserveHelperTextSpace />
            <Box />
            <FormInputSkeleton label="First name" reserveHelperTextSpace />
            <FormInputSkeleton label="Last name" reserveHelperTextSpace />
            <FormInputSkeleton label="Phone number" reserveHelperTextSpace />
            <FormInputSkeleton label="Date of birth" reserveHelperTextSpace />
            <FormInputSkeleton label="Role" />
            <Box />
            <FormInputSkeleton label="District" />
            <FormInputSkeleton label="Ward" />
          </>
        ) : (
          <>
            <ControlledTextField
              control={control}
              name="email"
              label="Email"
              placeholder="example@gmail.com"
            />
            <Box />
            <ControlledTextField
              control={control}
              name="firstName"
              label="First name"
            />
            <ControlledTextField
              control={control}
              name="lastName"
              label="Last name"
            />
            <ControlledTextField
              control={control}
              name="phoneNumber"
              label="Phone number"
            />
            <ControlledDatePicker
              control={control}
              name="dob"
              label="Date of birth"
            />
            {/* <FormControl fullWidth>
              <FormLabel>Date of birth</FormLabel>
              <DatePicker
                value={formValue.dob}
                onChange={(value) => setValue('dob', dayjs.utc(value))}
              />
            </FormControl> */}
            <ControlledSelect
              control={control}
              name="role"
              label="Role"
              options={[
                {
                  value: AccountRole.DISTRICT_OFFICER,
                  label: 'District officer',
                },
                {
                  value: AccountRole.WARD_OFFICER,
                  label: 'Ward officer',
                },
                {
                  value: AccountRole.CDO,
                  label: 'Cultural department officer',
                },
              ]}
            />
            <Box />
            {districts ? (
              <ControlledSelect
                control={control}
                name="districtId"
                label="District"
                disabled={formValue.role === AccountRole.CDO}
                options={
                  formValue.role === AccountRole.CDO
                    ? [{ value: -1, label: 'None' }]
                    : districts.data.map((e) => ({
                        value: e.id,
                        label: e.name,
                      }))
                }
              />
            ) : (
              <FormInputSkeleton label="District" />
            )}
            {wards ? (
              <ControlledSelect
                control={control}
                name="wardId"
                label="Ward"
                disabled={formValue.role !== AccountRole.WARD_OFFICER}
                options={
                  formValue.role !== AccountRole.WARD_OFFICER
                    ? [{ value: -1, label: 'None' }]
                    : wards.data
                        .filter((e) => e.districtId === formValue.districtId)
                        .map((e) => ({
                          value: e.id,
                          label: e.name,
                        }))
                }
              />
            ) : (
              <FormInputSkeleton label="Ward" />
            )}
          </>
        )}
      </Box>
    </StaticActionBar>
  );
};

export default AccountsDetail;
