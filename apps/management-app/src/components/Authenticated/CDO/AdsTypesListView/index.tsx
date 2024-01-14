import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import {
  GridColDef,
  GridRowsProp,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { ModalKey } from '@/constants/modal';
import {
  useDeleteAdsTypesMutation,
  useGetAdsTypesQuery,
} from '@/store/api/cdo/generalManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import CustomDataGrid from '../CustomDatagrid';
import CustomLink from '../CustomLink';
import DeleteIconButton from '../DeleteIconButton';
import StaticActionBar from '../StaticActionBar';

const AdsTypesListView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isFetching, refetch } = useGetAdsTypesQuery({
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('pageSize') || '10'),
  });

  const [rowCountState, setRowCountState] = useState(data?.totalCount || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.totalCount !== undefined ? data?.totalCount : prevRowCountState,
    );
  }, [data?.totalCount, setRowCountState]);

  const [deleteAdsTypes] = useDeleteAdsTypesMutation();

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
          field: 'name',
          headerName: 'Name',
          width: 300,
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
          renderHeader: () => null,
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'delete',
          width: 50,
          disableColumnMenu: true,
          align: 'center',
          sortable: false,
          renderHeader: () => null,
          renderCell: () => (
            <IconButton disabled>
              <DeleteIcon />
            </IconButton>
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
        { field: 'name', headerName: 'Name', width: 300 },
        {
          field: 'detail',
          width: 150,
          disableColumnMenu: true,
          sortable: false,
          renderHeader: () => null,
          renderCell: (params: GridRenderCellParams) => (
            <CustomLink to={'/adsTypes/' + params.row.id}>
              View details
            </CustomLink>
          ),
        },
        {
          field: 'delete',
          width: 50,
          disableColumnMenu: true,
          align: 'center',
          sortable: false,
          renderHeader: () => null,
          renderCell: (params: GridRenderCellParams) => (
            <DeleteIconButton
              onClick={() => {
                dispatch(
                  showModal(ModalKey.GENERAL, {
                    headerText: `Delete ${params.row.name} ?`,

                    primaryButtonText: 'Confirm',
                    onClickPrimaryButton: async () => {
                      try {
                        dispatch(showModal(null));
                        await deleteAdsTypes(params.row.id).unwrap();
                        await refetch();
                      } catch (error) {
                        /* empty */
                      }
                    },
                  }),
                );
              }}
            />
          ),
        },
      ];
  return (
    <StaticActionBar
      actionBar={
        <>
          <Fab color="primary" size="medium" onClick={() => refetch()}>
            <RefreshIcon
              sx={{ color: (theme) => theme.palette.common.white }}
            />
          </Fab>
          <Fab
            color="primary"
            size="medium"
            onClick={() => navigate('/ads-types/create')}
          >
            <AddIcon sx={{ color: (theme) => theme.palette.common.white }} />
          </Fab>
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

export default AdsTypesListView;
