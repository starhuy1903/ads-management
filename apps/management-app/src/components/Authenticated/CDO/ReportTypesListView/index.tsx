import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import Skeleton from '@mui/material/Skeleton';
import {
  GridColDef,
  GridRowsProp,
  GridRenderCellParams,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useDeleteReportTypesMutation,
  useGetReportTypesQuery,
} from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showError, showSuccess } from '@/utils/toast';
import CustomDataGrid from '../CustomDatagrid';
import CustomLink from '../CustomLink';
import StaticActionBar from '../StaticActionBar';

const ReportTypesListView = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isFetching } = useGetReportTypesQuery({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 10,
  });

  const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);

  const [rowCountState, setRowCountState] = useState(data?.rowsCount || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.rowsCount !== undefined ? data?.rowsCount : prevRowCountState,
    );
  }, [data?.rowsCount, setRowCountState]);

  const [deleteReportTypes] = useDeleteReportTypesMutation();

  const handleDeleteReportTypes = useCallback(async () => {
    if (data) {
      try {
        await deleteReportTypes(
          selectedRow.map((e) => (typeof e === 'number' ? e : parseInt(e))),
        ).unwrap();
        showSuccess('Report types deleted');
      } catch (error) {
        showError(
          isApiErrorResponse(error) ? error.data?.message : 'Unknown error',
        );
      }
    }
  }, [data, deleteReportTypes, selectedRow]);

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
            <CustomLink to={'/reportTypes/' + params.row.id}>
              View details
            </CustomLink>
          ),
        },
      ];
  return (
    <StaticActionBar
      actionBar={
        <>
          <Fab
            color="primary"
            size="medium"
            onClick={() => navigate('/report-types/create')}
          >
            <AddIcon sx={{ color: (theme) => theme.palette.common.white }} />
          </Fab>
          <Fab
            color="error"
            size="medium"
            disabled={selectedRow.length < 1 || isLoading}
            onClick={handleDeleteReportTypes}
          >
            <DeleteIcon sx={{ color: (theme) => theme.palette.common.white }} />
          </Fab>
        </>
      }
    >
      <CustomDataGrid
        rows={rows}
        columns={columns}
        checkboxSelection={true}
        onRowSelectionModelChange={(selected) => setSelectedRow(selected)}
        rowSelectionModel={selectedRow}
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

export default ReportTypesListView;
