import { ReactElement } from 'react';
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from 'recharts';

const data = [
  {
    name: '03/25/21',
    rating: 850,
  },
  {
    name: '04/10/21',
    rating: 875,
  },
  {
    name: '04/22/21',
    rating: 1000,
  },
  {
    name: '05/03/21',
    rating: 970,
  },
  {
    name: '05/25/21',
    rating: 400,
  },
  {
    name: '05/26/21',
    rating: 1050,
  },
  {
    name: '06/11/21',
    rating: 950,
  },
];

const RatingChart = (): ReactElement => {
  return (
    <AreaChart
      width={700}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="rating" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  );
};

export default RatingChart;
