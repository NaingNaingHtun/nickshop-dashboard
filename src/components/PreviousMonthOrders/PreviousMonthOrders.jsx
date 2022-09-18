import React from "react";
import {
  LineChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const data = [
  {
    name: "1-7",
    amt: 2400,
  },
  {
    name: "8-15",
    amt: 2210,
  },
  {
    name: "16-23",
    amt: 2290,
  },
  {
    name: "24-31",
    amt: 2000,
  },
];
const PreviousMonthOrders = ({ incomes }) => {
  return (
    <ResponsiveContainer width="100%" height="100%" aspect={1 / 0.7}>
      <AreaChart data={incomes}>
        <XAxis dataKey="name" />
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#4e60ff"
          fill="#4e60ff"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PreviousMonthOrders;
