import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/store';
import { ModalKey } from '@/constants/modal';
import { useGetStatictisQuery } from '@/store/api/statisticsApiSlice';
import { showModal } from '@/store/slice/modal';
import { IStatisticsViewOptions } from '@/types/cdoManagement';
import StaticActionBar from '../StaticActionBar';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const ReportStatistics = () => {
  const [viewOptions, setViewOptions] = useState<IStatisticsViewOptions>(() => {
    const now = dayjs().utc();
    return {
      mode: 'MONTH',
      wards: [],
      districts: [],
      year: now.get('year'),
      month: now.get('month'),
    };
  });

  const dispatch = useAppDispatch();

  const handleFilter = useCallback(() => {
    dispatch(
      showModal(ModalKey.STATISTICS_VIEW_OPTIONS, {
        viewOptions,
        onSubmit: (options: IStatisticsViewOptions) => setViewOptions(options),
      }),
    );
  }, [dispatch, viewOptions]);

  const { data, refetch } = useGetStatictisQuery({
    ...viewOptions,
    dateType: viewOptions.mode,
    dateValue:
      viewOptions.mode === 'MONTH'
        ? dayjs.utc(`${viewOptions.year}-01-01`).format()
        : dayjs
            .utc(`${viewOptions.year}-${viewOptions.month}-01`, 'YYYY-M-DD')
            .format(),
  });

  return (
    <StaticActionBar
      actionBar={
        <Button
          variant="contained"
          sx={{ color: 'common.white' }}
          onClick={handleFilter}
        >
          Filters
        </Button>
      }
    >
      {data?.data.resolved}
      {data?.data.unresolved}
    </StaticActionBar>
  );
};

export default ReportStatistics;
