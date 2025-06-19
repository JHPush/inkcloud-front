import React, { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { formatNumber, formatNumberAndUnit } from "../../hooks/dateUtils";

const BaseChart = ({
  data,
  formatXAxis,
  selectedData,
  selectedDate,
  dateInfo,
  onPrev,
  onNext,
  onDateSelect,
  showDatePicker,
  setShowDatePicker,
  isNextDisabled,
  datePickerProps,
  datePickerFormat = "YYYY-MM-DD"
}) => {
  useEffect(() => {
    if (!showDatePicker) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker, setShowDatePicker]);

  const customTooltipFormatter = (value) => formatNumber(value);

  if (!data || data.length === 0) {
    return (
      <div>
        <div className="flex gap-2 mb-4 items-center">
          <button
            onClick={onPrev}
            className="btn btn-circle btn-outline btn-sm"
            aria-label="이전"
          >
            &#8592;
          </button>
          <div className="relative">
            <span
              className="font-semibold text-primary cursor-pointer hover:text-blue-800 bg-primary/10 py-1 px-3 rounded-md border border-primary/20"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              {dateInfo}
            </span>
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-md p-3 z-10 date-picker-container border border-base-200">
                <div className="flex flex-col gap-2">
                  {datePickerProps}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onNext}
            className="btn btn-circle btn-outline btn-sm"
            aria-label="다음"
            disabled={isNextDisabled}
          >
            &#8594;
          </button>
        </div>
        <div className="w-full py-10 text-center text-gray-500 text-lg bg-white rounded-box border border-base-200">
          <span className="text-2xl align-middle mr-2">📉</span>
          <span className="align-middle">해당 기간에 매출이 없습니다.</span>
        </div>
      </div>
    );
  }

  // 컬러 팔레트
  const salesColor = "#bd1e1e";      // 인디고(매출)
  const orderColor = "#6366f1";      // 청록(주문건수)
  const itemColor = "#06b6d4";       // 연회색(수량)
  const labelGray = "#404347";       // Tailwind gray-500

  return (
    <div>
      {/* 날짜 네비 */}
      <div className="flex gap-2 mb-4 items-center">
        <button
          onClick={onPrev}
          className="btn btn-circle btn-outline btn-sm"
          aria-label="이전"
        >
          &#8592;
        </button>
        <div className="relative">
          <span
            className="font-semibold text-primary cursor-pointer hover:text-blue-800 bg-primary/10 py-1 px-3 rounded-md border border-primary/20"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            {dateInfo}
          </span>
          {showDatePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-md p-3 z-10 date-picker-container border border-base-200">
              <div className="flex flex-col gap-2">
                {datePickerProps}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onNext}
          className="btn btn-circle btn-outline btn-sm"
          aria-label="다음"
          disabled={isNextDisabled}
        >
          &#8594;
        </button>
      </div>

      {/* 매출 정보 카드 */}
      <div className="mb-6 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="flex flex-col items-center bg-white border border-gray-100 rounded-2xl py-4 px-2 min-w-[110px]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-2" style={{ background: "#f3f4f6" }}>
            <span role="img" aria-label="매출" className="text-xl" style={{ color: salesColor }}>💰</span>
          </div>
          <div className="text-xs font-semibold mb-1" style={{ color: labelGray }}>총 매출액</div>
          <div className="text-lg font-extrabold" style={{ color: salesColor }}>
            {formatNumber(selectedData?.totalSales)} 원
            {/* <span className="text-xs font-normal ml-1" style={{ color: salesColor }}>원</span> */}
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-100 rounded-2xl py-4 px-2 min-w-[110px]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-2" style={{ background: "#f3f4f6" }}>
            <span role="img" aria-label="주문" className="text-xl" style={{ color: orderColor }}>🛒</span>
          </div>
          <div className="text-xs font-semibold mb-1" style={{ color: labelGray }}>주문 건수</div>
          <div className="text-lg font-extrabold" style={{ color: orderColor }}>
            {formatNumber(selectedData?.orderCount)}
            <span className="text-xs font-normal ml-1" style={{ color: orderColor }}>건</span>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-100 rounded-2xl py-4 px-2 min-w-[110px]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-2" style={{ background: "#f3f4f6" }}>
            <span role="img" aria-label="상품" className="text-xl" style={{ color: itemColor }}>📦</span>
          </div>
          <div className="text-xs font-semibold mb-1" style={{ color: labelGray }}>수량</div>
          <div className="text-lg font-extrabold" style={{ color: itemColor }}>
            {formatNumber(selectedData?.itemCount)}
            <span className="text-xs font-normal ml-1" style={{ color: itemColor }}>개</span>
          </div>
        </div>
      </div>

      {/* 차트 카드 */}
      <div className="card bg-white border border-gray-100">
        <div className="card-body">
          <h3 className="card-title text-lg mb-2 font-bold flex items-center gap-2">
            <span className="text-2xl align-middle" style={{ color: orderColor }}>📊</span>
            <span className="align-middle" style={{ color: "#222" }}>매출 추이</span>
          </h3>
          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{ left: 40, right: 20, top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="dateKey"
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 13, fill: "#222" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={formatNumberAndUnit}
                  tick={{ fontSize: 13, fill: salesColor }}
                  axisLine={{ stroke: salesColor }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 13, fill: orderColor }}
                  axisLine={{ stroke: orderColor }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: `1px solid ${orderColor}`, background: "#f9fafb" }}
                  labelStyle={{ color: orderColor, fontWeight: "bold" }}
                  formatter={customTooltipFormatter}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  iconType="circle"
                  iconSize={16}
                />
                <Line
                  type="monotone"
                  dataKey="totalSales"
                  name="매출액"
                  stroke={salesColor}
                  strokeWidth={3}
                  yAxisId="left"
                  dot={{ r: 4, fill: salesColor }}
                  activeDot={{ r: 7, fill: salesColor, stroke: "#fff", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="orderCount"
                  name="주문건수"
                  stroke={orderColor}
                  strokeWidth={3}
                  yAxisId="right"
                  dot={{ r: 4, fill: orderColor }}
                  activeDot={{ r: 7, fill: orderColor, stroke: "#fff", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="itemCount"
                  name="주문상품수량"
                  stroke={itemColor}
                  strokeWidth={3}
                  yAxisId="right"
                  dot={{ r: 4, fill: itemColor }}
                  activeDot={{ r: 7, fill: itemColor, stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseChart;