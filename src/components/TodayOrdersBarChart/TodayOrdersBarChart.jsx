import React from "react";
import "./todayOrdersBarChart.scss";
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
    name: "Hat",
    amount: 2000,
  },
  {
    name: "Glasses",
    amount: 3000,
  },
  {
    name: "Coat",
    amount: 2000,
  },
  {
    name: "Shirt",
    amount: 2780,
  },
  {
    name: "Pant",
    amount: 1890,
  },
  {
    name: "Shoe",
    amount: 2390,
  },
];
const TodayOrdersBarChart = ({ orders }) => {
  return (
    <React.Fragment>
      <ResponsiveContainer width="100%" height="100%" aspect={1 / 1}>
        <BarChart data={orders}>
          <XAxis dataKey="name" />
          <YAxis dataKey="amount" />
          <Tooltip />
          <Bar dataKey="amount" fill="#4e60ff" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default TodayOrdersBarChart;
