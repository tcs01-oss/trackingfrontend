import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartOneProps {
    deliveredCount: number;
    processCount: number;
    bookingCount: number;
}

const ChartOne: React.FC<ChartOneProps> = ({ deliveredCount, processCount, bookingCount }) => {
  const [state, setState] = useState<any>({
    series: [
      {
        name: 'Shipments',
        data: [deliveredCount, processCount, bookingCount],
      },
    ],
  });

  // Update series when props change
  React.useEffect(() => {
    setState({
        series: [
          {
            name: 'Total Count',
            data: [deliveredCount, processCount, bookingCount],
          },
        ],
    })
  }, [deliveredCount, processCount, bookingCount]);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#10B981', '#3C50E0', '#F0950C'], // Green for Delivered, Blue for Process, Orange for Booking
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'bar',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },

      toolbar: {
        show: false,
      },
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            horizontal: false,
            columnWidth: '55%',
            distributed: true, // This distributes colors to each bar
        }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    xaxis: {
      categories: ['Delivered', 'In Process', 'Booking'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      forceNiceScale: true,
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#10B981]">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#10B981]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#10B981]">Delivered</p>
              <p className="text-sm font-medium">{deliveredCount}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#3C50E0]">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#3C50E0]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#3C50E0]">In Process</p>
              <p className="text-sm font-medium">{processCount}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#F0950C]">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#F0950C]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#F0950C]">Booking</p>
              <p className="text-sm font-medium">{bookingCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
