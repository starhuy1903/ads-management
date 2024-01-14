import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import {
  GridColDef,
  GridRowsProp,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { ModalKey } from '@/constants/modal';
import {
  useDeleteAccountsMutation,
  useLazyGetAccountsQuery,
} from '@/store/api/cdo/accountManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import { IAccountListViewOptions } from '@/types/cdoManagement';
import CustomDataGrid from '../CustomDatagrid';
import CustomLink from '../CustomLink';
import DeleteIconButton from '../DeleteIconButton';
import StaticActionBar from '../StaticActionBar';

dayjs.extend(utc);

const AccountsListView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const [viewOptions, setViewOptions] = useState<IAccountListViewOptions>({});

  const handleFilter = useCallback(() => {
    dispatch(
      showModal(ModalKey.ACCOUNT_LIST_VIEW_OPTIONS, {
        viewOptions,
        onSubmit: (options: IAccountListViewOptions) => setViewOptions(options),
      }),
    );
  }, [dispatch, viewOptions]);

  const [getAccounts, { data, isLoading, isFetching, isUninitialized }] =
    useLazyGetAccountsQuery();

  useEffect(() => {
    getAccounts({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('pageSize') || '10'),
      ...viewOptions,
    });
  }, [getAccounts, searchParams, viewOptions]);

  const [rowCountState, setRowCountState] = useState(data?.totalCount || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.totalCount !== undefined ? data?.totalCount : prevRowCountState,
    );
  }, [data?.totalCount, setRowCountState]);

  const [deleteAccounts] = useDeleteAccountsMutation();

  const rows: GridRowsProp =
    data?.data || Array.from({ length: 10 }, (_, i) => ({ id: i }));

  const columns: GridColDef[] =
    isLoading || isUninitialized
      ? [
          {
            field: 'id',
            headerName: 'ID',
            width: 70,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            renderCell: () => (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            ),
          },
          {
            field: 'email',
            headerName: 'Email',
            width: 300,
            renderCell: () => (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            ),
          },
          {
            field: 'firstName',
            headerName: 'First name',
            width: 200,
            renderCell: () => (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            ),
          },
          {
            field: 'lastName',
            headerName: 'Last name',
            width: 200,
            renderCell: () => (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            ),
          },
          {
            field: 'phoneNumber',
            headerName: 'Phone number',
            width: 200,
            renderCell: () => (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            ),
          },
          {
            field: 'dob',
            headerName: 'Date of birth',
            width: 200,
            renderCell: () => (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            ),
          },
          {
            field: 'role',
            headerName: 'Role',
            width: 150,
            renderCell: () => (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            ),
          },
          {
            field: 'district',
            headerName: 'District',
            width: 150,
            renderCell: () => (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            ),
          },
          {
            field: 'ward',
            headerName: 'Ward',
            width: 150,
            renderCell: () => (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            ),
          },
          {
            field: 'detail',
            width: 150,
            disableColumnMenu: true,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => null,
            renderCell: () => (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            ),
          },
          // {
          //   field: 'delete',
          //   width: 50,
          //   disableColumnMenu: true,
          //   align: 'center',
          //   sortable: false,
          //   renderHeader: () => null,
          //   renderCell: () => (
          //     <IconButton disabled>
          //       <DeleteIcon />
          //     </IconButton>
          //   ),
          // },
        ]
      : [
          {
            field: 'id',
            headerName: 'ID',
            width: 70,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
          },
          { field: 'email', headerName: 'Email', width: 300 },
          { field: 'firstName', headerName: 'First name', width: 200 },
          { field: 'lastName', headerName: 'Last name', width: 200 },
          {
            field: 'phoneNumber',
            headerName: 'Phone number',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
              <Typography fontSize="0.875rem" noWrap>
                {params.value ? params.value : <CloseIcon />}
              </Typography>
            ),
          },
          {
            field: 'dob',
            headerName: 'Date of birth',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
              <Typography fontSize="0.875rem" noWrap>
                {params.value ? (
                  dayjs.utc(params.value).format('YYYY-MM-DD')
                ) : (
                  <CloseIcon />
                )}
              </Typography>
            ),
          },
          {
            field: 'role',
            headerName: 'Role',
            width: 150,
          },
          {
            field: 'district',
            headerName: 'District',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
              <Typography fontSize="0.875rem" noWrap>
                {params.value ? (
                  params.value.name
                ) : params.row.ward ? (
                  params.row.ward.district.name
                ) : (
                  <CloseIcon />
                )}
              </Typography>
            ),
          },
          {
            field: 'ward',
            headerName: 'Ward',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
              <Typography fontSize="0.875rem" noWrap>
                {params.value ? params.value.name : <CloseIcon />}
              </Typography>
            ),
          },
          {
            field: 'detail',
            width: 150,
            disableColumnMenu: true,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => null,
            renderCell: (params: GridRenderCellParams) => (
              <CustomLink to={'/accounts/' + params.row.id}>
                View details
              </CustomLink>
            ),
          },
          // {
          //   field: 'delete',
          //   width: 50,
          //   disableColumnMenu: true,
          //   align: 'center',
          //   sortable: false,
          //   renderHeader: () => null,
          //   renderCell: (params: GridRenderCellParams) => (
          //     <DeleteIconButton
          //       onClick={() => {
          //         dispatch(
          //           showModal(ModalKey.GENERAL, {
          //             headerText: `Delete ${params.row.name} ?`,
          //             primaryButtonText: 'Confirm',
          //             onClickPrimaryButton: async () => {
          //               try {
          //                 dispatch(showModal(null));
          //                 await deleteAccounts(params.row.id).unwrap();
          //                 await getAccounts({
          //                   page: parseInt(searchParams.get('page') || '1'),
          //                   limit: parseInt(
          //                     searchParams.get('pageSize') || '10',
          //                   ),
          //                   ...viewOptions,
          //                 });
          //               } catch (error) {
          //                 /* empty */
          //               }
          //             },
          //           }),
          //         );
          //       }}
          //     />
          //   ),
          // },
        ];
  return (
    <StaticActionBar
      actionBar={
        <>
          <Box
            sx={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '8px',
              marginBottom: '16px',

              '& .MuiTypography-root': {
                fontSize: '0.875rem',
              },
            }}
          >
            <Typography fontWeight="bold">Role:</Typography>
            <Typography>{viewOptions.role || 'Any'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Fab color="primary" size="medium" onClick={handleFilter}>
              <FilterAltIcon
                sx={{ color: (theme) => theme.palette.common.white }}
              />
            </Fab>
            <Fab
              color="primary"
              size="medium"
              onClick={() => {
                getAccounts({
                  page: parseInt(searchParams.get('page') || '1'),
                  limit: parseInt(searchParams.get('pageSize') || '10'),
                  ...viewOptions,
                });
              }}
            >
              <RefreshIcon
                sx={{ color: (theme) => theme.palette.common.white }}
              />
            </Fab>
            <Fab
              color="primary"
              size="medium"
              onClick={() => navigate('/accounts/create')}
            >
              <AddIcon sx={{ color: (theme) => theme.palette.common.white }} />
            </Fab>
          </Box>
        </>
      }
    >
      <CustomDataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        rowCount={rowCountState}
        loading={isFetching}
        pageSizeOptions={[10, 20, 50]}
        paginationMode="server"
        paginationModel={{
          page: parseInt(searchParams.get('page') || '1') - 1,
          pageSize: parseInt(searchParams.get('pageSize') || '10'),
        }}
        onPaginationModelChange={(model) => {
          setSearchParams({
            page: (model.page + 1).toString(),
            pageSize: model.pageSize.toString(),
          });
        }}
      />
    </StaticActionBar>
  );
};

export default AccountsListView;
