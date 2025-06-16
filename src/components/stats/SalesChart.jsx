import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import DailyStats from "./DailyStats";
import WeeklyStats from "./WeeklyStats";
import MonthlyStats from "./MonthlyStats";

const TYPE_OPTIONS = [
  { key: "daily", label: "일간 매출" },
  { key: "weekly", label: "주간 매출" },
  { key: "monthly", label: "월간 매출" },
];

const SalesChart = () => {
  const [type, setType] = useState("daily");

  // 타입에 따라 적절한 컴포넌트 렌더링
  const renderChart = () => {
    switch(type) {
      case "daily":
        return <DailyStats />;
      case "weekly":
        return <WeeklyStats />;
      case "monthly":
        return <MonthlyStats />;
      default:
        return <DailyStats />;
    }
  };

  return (
 
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
        </div>

        {renderChart()}
      </div>

  );
};

export default SalesChart;