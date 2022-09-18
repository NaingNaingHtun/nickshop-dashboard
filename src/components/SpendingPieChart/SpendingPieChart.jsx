import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import "./style.scss";
const data = [
  { name: "Hat", value: 400 },
  { name: "Glasses", value: 300 },
  { name: "Coat", value: 300 },
  { name: "Shirt", value: 200 },
  { name: "Pant", value: 500 },
  { name: "Shoe", value: 800 },
];

const COLORS = [
  "#3D3A0D",
  "#0218BD",
  "#D1B202",
  "#1B015C",
  "#015C55",
  "#933A0D",
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const SpendingPieChart = () => {
  return (
    <div className="spendingPieChart">
      <h1>Spendings By Products(Last 6 months)</h1>
      <ResponsiveContainer aspect={1 / 1}>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingPieChart;
