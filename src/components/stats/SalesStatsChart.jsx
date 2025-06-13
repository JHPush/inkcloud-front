import React, { useEffect, useState } from "react";
import { getSalesStat } from "../../api/statsApi";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import AdminLayout from "../../layouts/AdminLayout";

const TYPE_OPTIONS = [
  { key: "daily", label: "일별" },
  { key: "weekly", label: "주별" },
  { key: "monthly", label: "월별" },
];

const SalesStatsChart = () => {
  const [type, setType] = useState("daily");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!start || !end) return;
        const result = await getSalesStat(type, start, end);
        setData(result);
      } catch (e) {
        console.error("error:", e);
      }
    };
    fetch();
  }, [type, start, end]);

  return (
    <AdminLayout>
      <div>
        <div className="flex gap-2 mb-4 items-center">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setType(opt.key)}
              className={`px-4 py-2 rounded-full font-semibold border transition ${
                type === opt.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <span>~</span>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateKey" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalSales"
                name="매출액"
                stroke="#8884d8"
                yAxisId="left"
              />
              <Line
                type="monotone"
                dataKey="orderCount"
                name="주문건수"
                stroke="#82ca9d"
                yAxisId="right"
              />
              <Line
                type="monotone"
                dataKey="itemCount"
                name="주문상품수량"
                stroke="#ffc658"
                yAxisId="right"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SalesStatsChart;