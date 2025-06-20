import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import DailyStats from "./DailyStats";
import WeeklyStats from "./WeeklyStats";
import MonthlyStats from "./MonthlyStats";

const TYPE_OPTIONS = [
  { key: "daily", label: "일간" },
  { key: "weekly", label: "주간" },
  { key: "monthly", label: "월간" },
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
 
      <div className="max-w-6xl mx-auto bg-base-100 bg-white rounded-box shadow p-8 mt-8">
        <div className="flex justify-center gap-4 mb-8">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setType(opt.key)}
              className={`px-2 py-1 text-sm rounded-lg font-semibold border transition-all
                ${type === opt.key
                  ? "bg-blue-500/80 text-white border-blue-500 shadow"
                  : "bg-blue-100/60 text-blue-700 border-blue-200 hover:bg-blue-200/80"
                }`}
              style={{ minWidth: 100 }}
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