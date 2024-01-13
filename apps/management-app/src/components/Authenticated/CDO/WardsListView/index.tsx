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
  useDeleteWardsMutation,
  useGetDistrictsQuery,
  useGetWardsQuery,
} from '@/store/api/generalManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import CustomDataGrid from '../CustomDatagrid';
import CustomLink from '../CustomLink';
import DeleteIconButton from '../DeleteIconButton';
import StaticActionBar from '../StaticActionBar';

const WardsListView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isFetching, refetch } = useGetWardsQuery({
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('pageSize') || '10'),
  });

  const { data: districts, isLoading: districtLoading } = useGetDistrictsQuery(
    {},
  );

  const [rowCountState, setRowCountState] = useState(data?.totalCount || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.totalCount !== undefined ? data?.totalCount : prevRowCountState,
    );
  }, [data?.totalCount, setRowCountState]);

  const [deleteWards] = useDeleteWardsMutation();

  const rows: GridRowsProp =
    data?.data || Array.from({ length: 10 }, (_, i) => ({ id: i }));

  const columns: GridColDef[] =
    isLoading || districtLoading
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
            field: 'districtId',
            headerName: 'District',
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
            field: 'districtId',
            headerName: 'District',
            width: 300,
            renderCell: (params: GridRenderCellParams) =>
              districts?.data.find((e) => e.id === params.value)?.name,
          },
          {
            field: 'detail',
            width: 150,
            disableColumnMenu: true,
            sortable: false,
            renderHeader: () => null,
            renderCell: (params: GridRenderCellParams) => (
              <CustomLink to={'/wards/' + params.row.id}>
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
                          await deleteWards(params.row.id).unwrap();
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
            onClick={() => navigate('/wards/create')}
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

export default WardsListView;
