import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const PrevSixMonthsOrders = ({ incomes }) => {
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

export default PrevSixMonthsOrders;
