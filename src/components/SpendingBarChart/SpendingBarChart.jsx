import React from "react";
import "./style.scss";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

const SpendingBarChart = ({ data, label }) => {
  return (
    <div className="barChart">
      <h1>{label}</h1>
      <ResponsiveContainer width="100%" height="100%" aspect={1 / 1}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis dataKey="total" />
          <Tooltip />
          <Bar dataKey="total" fill="#4e60ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingBarChart;
