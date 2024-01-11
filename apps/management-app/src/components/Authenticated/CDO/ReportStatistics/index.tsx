import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '@/store';
import { MONTHS } from '@/constants/app';
import { ModalKey } from '@/constants/modal';
import {
  useGetDistrictsQuery,
  useGetWardsQuery,
} from '@/store/api/generalManagementApiSlice';
import { useLazyGetStatictisQuery } from '@/store/api/statisticsApiSlice';
import { showModal } from '@/store/slice/modal';
import { IStatisticsViewOptions, Ward } from '@/types/cdoManagement';
import StaticActionBar from '../StaticActionBar';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const ReportStatistics = () => {
  const [viewOptions, setViewOptions] = useState<IStatisticsViewOptions>(() => {
    const now = dayjs().utc();
    return {
      mode: 'MONTH',
      wardIds: [],
      districtIds: [],
      year: now.get('year'),
      month: now.get('month') + 1,
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

  const [getStatistics, { data }] = useLazyGetStatictisQuery();

  useEffect(() => {
    getStatistics({
      districtIds:
        viewOptions.districtIds.length > 0
          ? viewOptions.districtIds
          : undefined,
      wardIds: viewOptions.wardIds.length > 0 ? viewOptions.wardIds : undefined,
      dateType: viewOptions.mode,
      dateValue:
        viewOptions.mode === 'YEAR'
          ? dayjs.utc(`${viewOptions.year}-01-01`).format()
          : dayjs
              .utc(`${viewOptions.year}-${viewOptions.month}-01`, 'YYYY-M-DD')
              .format(),
    });
  }, [getStatistics, viewOptions]);

  const chartOptions = useMemo(() => {
    let xAxis;
    if (viewOptions.mode === 'YEAR') {
      xAxis = {
        categories: Array.from({ length: 12 }, (e, i) => MONTHS[i + 1]),
      };
    } else {
      const daysInMonth = dayjs(viewOptions.month).daysInMonth();
      xAxis = {
        categories: Array.from({ length: daysInMonth }, (e, i) => i + 1),
      };
    }

    const series = data
      ? [
          {
            name: 'Resolved',
            data: data.data.resolved,
            stack: 'Report',
          },
          {
            name: 'Unresolved',
            data: data.data.unresolved,
            stack: 'Report',
          },
        ]
      : [
          {
            name: 'Resolved',
            data: [],
            stack: 'Report',
          },
          {
            name: 'Unresolved',
            data: [],
            stack: 'Report',
          },
        ];

    return {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Report statistic',
        align: 'left',
      },
      xAxis,
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: 'Report count',
        },
      },
      tooltip: {
        format:
          '<b>{key}</b><br/>{series.name}: {y}<br/>' +
          'Total: {point.stackTotal}',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        },
      },
      series,
    };
  }, [data, viewOptions.mode, viewOptions.month]);

  const { data: districts } = useGetDistrictsQuery({});
  const { data: wards } = useGetWardsQuery({});

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
            <Typography fontWeight="bold">Viewing data in:</Typography>
            <Typography>{viewOptions.mode}</Typography>
            <Typography fontWeight="bold">Year:</Typography>
            <Typography>{viewOptions.year}</Typography>
            <Typography fontWeight="bold">Month:</Typography>
            <Typography>{MONTHS[viewOptions.month]}</Typography>
            <Typography fontWeight="bold">District:</Typography>
            {districts ? (
              <Typography>
                {viewOptions.districtIds.length > 0
                  ? districts.data.find(
                      (e) => e.id === viewOptions.districtIds[0],
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
                {viewOptions.wardIds.length > 0
                  ? wards.data
                      .reduce((accum: Array<string>, e: Ward) => {
                        return viewOptions.wardIds.includes(e.id)
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              sx={{ color: 'common.white' }}
              onClick={handleFilter}
            >
              Options
            </Button>
          </Box>
        </>
      }
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        immutable
      />
    </StaticActionBar>
  );
};

export default ReportStatistics;
