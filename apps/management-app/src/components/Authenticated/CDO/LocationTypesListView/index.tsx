import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
import {
  useDeleteLocationTypesMutation,
  useGetLocationTypesQuery,
} from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showError, showSuccess } from '@/utils/toast';
import CustomDataGrid from '../CustomDatagrid';
import CustomLink from '../CustomLink';
import DeleteIconButton from '../DeleteIconButton';
import StaticActionBar from '../StaticActionBar';

const LocationTypesListView = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isFetching, refetch } = useGetLocationTypesQuery({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 10,
  });

  const [rowCountState, setRowCountState] = useState(data?.rowsCount || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.rowsCount !== undefined ? data?.rowsCount : prevRowCountState,
    );
  }, [data?.rowsCount, setRowCountState]);

  const [deleteLocationTypes] = useDeleteLocationTypesMutation();

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
            <CustomLink to={'/location-types/' + params.row.id}>
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
              onClick={async () => {
                try {
                  await deleteLocationTypes(params.row.id).unwrap();
                  await refetch();
                  showSuccess('Location type deleted');
                } catch (error) {
                  showError(
                    isApiErrorResponse(error)
                      ? error.data?.message
                      : 'Something went wrong',
                  );
                }
              }}
            />
          ),
        },
      ];
  return (
    <StaticActionBar
      actionBar={
        <Fab
          color="primary"
          size="medium"
          onClick={() => navigate('/location-types/create')}
        >
          <AddIcon sx={{ color: (theme) => theme.palette.common.white }} />
        </Fab>
      }
    >
      <CustomDataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        rowCount={rowCountState}
        loading={isFetching}
        pageSizeOptions={[10]}
        paginationMode="server"
        paginationModel={{
          page: parseInt(searchParams.get('page') || '1') - 1,
          pageSize: 10,
        }}
        onPaginationModelChange={(model) => {
          setSearchParams({ page: (model.page + 1).toString() });
        }}
      />
    </StaticActionBar>
  );
};

export default LocationTypesListView;
