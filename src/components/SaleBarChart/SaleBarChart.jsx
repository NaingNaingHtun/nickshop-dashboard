import React from "react";
import "./saleBarChart.scss";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
const data = [
  {
    name: "January",
    amount: 2000,
  },
  {
    name: "Feburary",
    amount: 3000,
  },
  {
    name: "March",
    amount: 2000,
  },
  {
    name: "April",
    amount: 2780,
  },
  {
    name: "May",
    amount: 1890,
  },
  {
    name: "June",
    amount: 2390,
  },
];
const SaleBarChart = () => {
  return (
    <div className="barChart">
      <h1>Last 6 months Sales</h1>
      <ResponsiveContainer width="100%" height="100%" aspect={1 / 1}>
        <BarChart data={data} onMouseEnter={(e) => console.log("hello")}>
          <XAxis dataKey="name" />
          <YAxis dataKey="amount" />
          <Tooltip />
          <Bar dataKey="amount" fill="#4e60ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SaleBarChart;
