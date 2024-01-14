import {
  Box,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import CenterLoading from '@/components/Common/CenterLoading';
import { Edit, Info, Response } from '@/components/Common/Icons';
import { ListWrapper } from '@/components/Common/Layout/ScreenWrapper';
import WardSelect from '@/components/Common/WardSelect';
import { PanelStatus } from '@/constants/panel';
import { UserRole } from '@/constants/user';
import { useGetPanelsOfficerQuery } from '@/store/api/officer/panelApiSlide';
import { Panel } from '@/types/officer-management';
import { formatDateTime } from '@/utils/datetime';
import { capitalize } from '@/utils/format-string';

const titles = [
  'ID',
  'Location Name',
  'Address',
  'Ward',
  'District',
  'Company Email',
  'Created Time',
  'Updated Time',
  'Status',
  '',
];

export default function PanelList() {
  const role = useAppSelector((state) => state.user?.profile?.role);

  const [page, setPage] = useState<number>(1);
  const [panels, setPanels] = useState<Panel[]>([]);
  const [wards, setWards] = useState<number[]>([]);

  const { data, isLoading, refetch } = useGetPanelsOfficerQuery({
    page: page,
    take: 10,
    wards: wards,
  });

  useEffect(() => {
    refetch();
  }, [panels, page, refetch, wards]);

  useEffect(() => {
    if (data) {
      setPanels(data.data);
    }
  }, [data]);

  if (isLoading || !panels) {
    return <CenterLoading />;
  }

  return (
    <ListWrapper label="Panels" btnLabel="Create" btnLink={'/panels/create'}>
      <Box
        sx={{
          width: '100%',
        }}
      >
        {role === UserRole?.DISTRICT_OFFICER && (
          <WardSelect wards={wards} setWards={setWards} />
        )}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="panels">
            <TableHead>
              <TableRow>
                {titles.map((title) => (
                  <TableCell align="center" key={title}>
                    {title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {panels?.length !== 0 ? (
                panels.map((panel: Panel) => (
                  <TableRow key={panel?.id}>
                    <TableCell align="center">{panel?.id}</TableCell>
                    <TableCell align="center">
                      {panel?.location?.name}
                    </TableCell>
                    <TableCell align="center">
                      {panel?.location?.fullAddress}
                    </TableCell>
                    <TableCell align="center">
                      {panel?.location?.ward?.name}
                    </TableCell>
                    <TableCell align="center">
                      {panel?.location?.district?.name}
                    </TableCell>
                    <TableCell align="center">{panel?.companyEmail}</TableCell>
                    <TableCell align="center">
                      {formatDateTime(panel?.createdAt)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDateTime(panel?.updatedAt)}
                    </TableCell>
                    <TableCell align="center">
                      {capitalize(panel?.status)}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                        }}
                      >
                        <Info link={`/panels/${panel?.id}`} />
                        {panel?.status === PanelStatus?.APPROVE && (
                          <Edit link={`/panels/${panel?.id}/edit`} />
                        )}

                        {panel?.status === PanelStatus?.DRAFT && (
                          <Response
                            link={`/panels/${panel?.id}/send-request`}
                            title="Send Request"
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={9}>
                    No results
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Pagination
        count={data?.totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
      />
    </ListWrapper>
  );
}
