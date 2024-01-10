import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
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
  useDeletePanelsMutation,
  useGetPanelsQuery,
} from '@/store/api/adsManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import { displayTimestamp } from '@/utils/format';
import CustomDataGrid from '../CustomDatagrid';
import CustomLink from '../CustomLink';
import DeleteIconButton from '../DeleteIconButton';
import StaticActionBar from '../StaticActionBar';

const PanelsListView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isFetching, refetch } = useGetPanelsQuery({
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('pageSize') || '10'),
  });

  const [rowCountState, setRowCountState] = useState(data?.totalCount || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.totalCount !== undefined ? data?.totalCount : prevRowCountState,
    );
  }, [data?.totalCount, setRowCountState]);

  const [deletePanels] = useDeletePanelsMutation();

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
        // {
        //   field: 'name',
        //   headerName: 'Name',
        //   width: 300,
        //   renderCell: () => (
        //     <Skeleton
        //       variant="text"
        //       sx={{ width: '100%', fontSize: '0.875rem' }}
        //     />
        //   ),
        // },
        {
          field: 'type',
          headerName: 'Type',
          width: 200,
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'width',
          headerName: 'Width',
          width: 100,
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
          field: 'height',
          headerName: 'Height',
          width: 100,
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
          field: 'location',
          headerName: 'Location',
          width: 200,
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'createContractDate',
          headerName: 'Contract created on',
          width: 300,
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'expiredContractDate',
          headerName: 'Contract expire on',
          width: 300,
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'companyEmail',
          headerName: 'Company email',
          width: 250,
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'companyNumber',
          headerName: 'Company number',
          width: 200,
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'createdAt',
          headerName: 'Created at',
          width: 300,
          renderCell: () => (
            <Skeleton
              variant="text"
              sx={{ width: '100%', fontSize: '0.875rem' }}
            />
          ),
        },
        {
          field: 'updatedAt',
          headerName: 'Last modified at',
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
        // { field: 'name', headerName: 'Name', width: 300 },
        {
          field: 'type',
          headerName: 'Type',
          width: 200,
          renderCell: (params: GridRenderCellParams) => (
            <Typography fontSize="0.875rem">{params.value.name}</Typography>
          ),
        },
        {
          field: 'width',
          headerName: 'Width',
          width: 100,
          align: 'center',
          headerAlign: 'center',
          renderCell: (params: GridRenderCellParams) => (
            <Typography fontSize="0.875rem">{params.value + 'm'}</Typography>
          ),
        },
        {
          field: 'height',
          headerName: 'Height',
          width: 100,
          align: 'center',
          headerAlign: 'center',
          renderCell: (params: GridRenderCellParams) => (
            <Typography fontSize="0.875rem">{params.value + 'm'}</Typography>
          ),
        },
        {
          field: 'location',
          headerName: 'Location',
          width: 200,
          renderCell: (params: GridRenderCellParams) => (
            <CustomLink to={'/locations/' + params.value.id}>
              <Typography fontSize="0.875rem">{params.value.name}</Typography>
            </CustomLink>
          ),
        },
        {
          field: 'createContractDate',
          headerName: 'Contract created on',
          width: 300,
          renderCell: (params: GridRenderCellParams) => (
            <Typography fontSize="0.875rem">
              {displayTimestamp(params.value)}
            </Typography>
          ),
        },
        {
          field: 'expiredContractDate',
          headerName: 'Contract expire on',
          width: 300,
          renderCell: (params: GridRenderCellParams) => (
            <Typography fontSize="0.875rem">
              {displayTimestamp(params.value)}
            </Typography>
          ),
        },
        { field: 'companyEmail', headerName: 'Company email', width: 250 },
        { field: 'companyNumber', headerName: 'Company number', width: 200 },
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
          sortable: false,
          align: 'center',
          headerAlign: 'center',
          renderHeader: () => null,
          renderCell: (params: GridRenderCellParams) => (
            <CustomLink to={'/panels/' + params.row.id}>
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
                        await deletePanels(params.row.id).unwrap();
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
        <Fab
          color="primary"
          size="medium"
          onClick={() => navigate('/panels/create')}
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

export default PanelsListView;
