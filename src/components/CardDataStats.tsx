import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  total: string;
  rate?: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
  link?: string;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
  link,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-medium">{title}</span>
        </div>

        {rate && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              levelUp && 'text-meta-3'
            } ${levelDown && 'text-meta-5'} `}
          >
            {rate}

            {levelUp && (
              <svg
                className="fill-meta-3"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                  fill=""
                />
              </svg>
            )}

            {levelDown && (
              <svg
                className="fill-meta-5"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.64284 8.52263L9.09103 5.17013L10 6.05388L5 10.9151L-8.98482e-07 6.05388L0.908973 5.17013L4.35716 8.52263L4.35716 0.915124L5.64284 0.915124L5.64284 8.52263Z"
                  fill=""
                />
              </svg>
            )}
          </span>
        )}
      </div>
      {link && (
         <div className="mt-4">
            <a href={link} className="text-sm text-primary hover:underline">View Details &rarr;</a>
         </div>
      )}
    </div>
  );
};

export default CardDataStats;
