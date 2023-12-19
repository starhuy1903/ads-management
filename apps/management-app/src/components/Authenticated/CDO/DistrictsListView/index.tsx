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
  useDeleteDistrictsMutation,
  useGetDistrictsQuery,
} from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showError, showSuccess } from '@/utils/toast';
import CustomDataGrid from '../CustomDatagrid';
import CustomLink from '../CustomLink';
import DeleteIconButton from '../DeleteIconButton';
import StaticActionBar from '../StaticActionBar';

const DistrictsListView = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isFetching, refetch } = useGetDistrictsQuery({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 10,
  });

  const [rowCountState, setRowCountState] = useState(data?.rowsCount || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.rowsCount !== undefined ? data?.rowsCount : prevRowCountState,
    );
  }, [data?.rowsCount, setRowCountState]);

  const [deleteDistricts] = useDeleteDistrictsMutation();

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
            <CustomLink to={'/districts/' + params.row.id}>
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
                  await deleteDistricts(params.row.id).unwrap();
                  await refetch();
                  showSuccess('District deleted');
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
          onClick={() => navigate('/districts/create')}
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

export default DistrictsListView;
