import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import {
  GridColDef,
  GridRowsProp,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetPermissionRequestsQuery } from '@/store/api/requestManagementApiSlice';
import { displayTimestamp } from '@/utils/format';
import CustomDataGrid from '../CustomDatagrid';
import CustomLink from '../CustomLink';
import StaticActionBar from '../StaticActionBar';

const PermissionRequestsListView = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isFetching } = useGetPermissionRequestsQuery({
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('pageSize') || '10'),
  });

  const [rowCountState, setRowCountState] = useState(data?.totalCount || 0);

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
          field: 'createdAt',
          headerName: 'Created',
          width: 300,
          sortable: false,
          renderCell: (params: GridRenderCellParams) => (
            <Typography>{displayTimestamp(params.value)}</Typography>
          ),
        },
        {
          field: 'updatedAt',
          headerName: 'Last update',
          width: 300,
          sortable: false,
          renderCell: (params: GridRenderCellParams) => (
            <Typography>{displayTimestamp(params.value)}</Typography>
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
            <CustomLink to={'/permission-requests/' + params.row.id}>
              View details
            </CustomLink>
          ),
        },
      ];
  return (
    <StaticActionBar>
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

export default PermissionRequestsListView;
