import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import {
  GridColDef,
  GridRowsProp,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { ModalKey } from '@/constants/modal';
import {
  useGetDistrictsQuery,
  useGetWardsQuery,
} from '@/store/api/cdo/generalManagementApiSlice';
import { useLazyGetModificationRequestsQuery } from '@/store/api/cdo/requestManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import {
  AdsRequestStatus,
  IAdsRequestViewOptions,
  Ward,
} from '@/types/cdoManagement';
import { displayTimestamp } from '@/utils/format';
import CustomDataGrid from '../CustomDatagrid';
import CustomLink from '../CustomLink';
import StaticActionBar from '../StaticActionBar';

const ModificationRequestsListView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const [viewOptions, setViewOptions] = useState<IAdsRequestViewOptions>({
    districts: [],
    wards: [],
    status: AdsRequestStatus.PENDING,
  });

  const handleFilter = useCallback(() => {
    dispatch(
      showModal(ModalKey.ADS_REQUEST_VIEW_OPTIONS, {
        viewOptions,
        onSubmit: (options: IAdsRequestViewOptions) => setViewOptions(options),
      }),
    );
  }, [dispatch, viewOptions]);

  const [getModificationRequests, { data, isLoading, isFetching }] =
    useLazyGetModificationRequestsQuery();

  useEffect(() => {
    getModificationRequests({
      page: parseInt(searchParams.get('page') || '1'),
      take: parseInt(searchParams.get('pageSize') || '10'),
      ...viewOptions,
    });
  }, [getModificationRequests, searchParams, viewOptions]);

  const [rowCountState, setRowCountState] = useState(data?.totalCount || 0);

  const { data: districts } = useGetDistrictsQuery({});
  const { data: wards } = useGetWardsQuery({});

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.totalCount !== undefined ? data?.totalCount : prevRowCountState,
    );
  }, [data?.totalCount, setRowCountState]);

  const rows: GridRowsProp =
    data?.data || Array.from({ length: 10 }, (_, i) => ({ id: i }));

  const columns: GridColDef[] = isLoading
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
          field: 'reason',
          headerName: 'Reason',
          width: 300,
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'targetType',
          headerName: 'Data modifying target',
          width: 200,
          align: 'center',
          headerAlign: 'center',
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'status',
          headerName: 'Status',
          width: 200,
          align: 'center',
          headerAlign: 'center',
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'createdAt',
          width: 300,
          disableColumnMenu: true,
          sortable: false,
          renderHeader: () => null,
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'updatedAt',
          width: 300,
          disableColumnMenu: true,
          sortable: false,
          renderHeader: () => null,
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
          align: 'center',
          sortable: false,
          renderHeader: () => null,
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
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
        { field: 'reason', headerName: 'Reason', width: 300 },
        {
          field: 'targetType',
          headerName: 'Data modifying target',
          width: 200,
          align: 'center',
          headerAlign: 'center',
        },
        {
          field: 'status',
          headerName: 'Status',
          width: 200,
          align: 'center',
          headerAlign: 'center',
        },
        {
          field: 'createdAt',
          headerName: 'Created',
          width: 300,
          sortable: false,
          renderCell: (params: GridRenderCellParams) => (
            <Typography fontSize="0.875rem">
              {displayTimestamp(params.value)}
            </Typography>
          ),
        },
        {
          field: 'updatedAt',
          headerName: 'Last update',
          width: 300,
          sortable: false,
          renderCell: (params: GridRenderCellParams) => (
            <Typography fontSize="0.875rem">
              {displayTimestamp(params.value)}
            </Typography>
          ),
        },
        {
          field: 'detail',
          width: 150,
          disableColumnMenu: true,
          align: 'center',
          sortable: false,
          renderHeader: () => null,
          renderCell: (params: GridRenderCellParams) => (
            <CustomLink to={'/modification-requests/' + params.row.id}>
              View details
            </CustomLink>
          ),
        },
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
            <Typography fontWeight="bold">Status:</Typography>
            <Typography>{viewOptions.status || 'Any'}</Typography>
            <Typography fontWeight="bold">Target type:</Typography>
            <Typography>{viewOptions.targetType || 'Any'}</Typography>
            <Typography fontWeight="bold" sx={{ gridColumn: 1 }}>
              District:
            </Typography>
            {districts ? (
              <Typography>
                {viewOptions.districts.length > 0
                  ? districts.data.find(
                      (e) => e.id === viewOptions.districts[0],
                    )?.name
                  : 'All'}
              </Typography>
            ) : (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            )}
            <Typography fontWeight="bold">Wards:</Typography>
            {wards ? (
              <Typography sx={{ gridColumn: '4 / span 3' }} noWrap>
                {viewOptions.wards.length > 0
                  ? wards.data
                      .reduce((accum: Array<string>, e: Ward) => {
                        return viewOptions.wards.includes(e.id)
                          ? accum.concat(e.name)
                          : accum;
                      }, [])
                      .join(', ')
                  : 'All'}
              </Typography>
            ) : (
              <Skeleton
                variant="text"
                sx={{ width: '100%', fontSize: '0.875rem' }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Fab color="primary" size="medium" onClick={handleFilter}>
              <FilterAltIcon
                sx={{ color: (theme) => theme.palette.common.white }}
              />
            </Fab>
            <Fab
              color="primary"
              size="medium"
              onClick={() => {
                getModificationRequests({
                  page: parseInt(searchParams.get('page') || '1'),
                  take: parseInt(searchParams.get('pageSize') || '10'),
                  ...viewOptions,
                });
              }}
            >
              <RefreshIcon
                sx={{ color: (theme) => theme.palette.common.white }}
              />
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

export default ModificationRequestsListView;
