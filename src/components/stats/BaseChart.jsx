import React, { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { formatNumber, formatNumberAndUnit, formatYAxis } from "../../hooks/dateUtils"; 

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
  // 날짜 선택기 외부 클릭 시 닫기
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

  // 툴팁 커스터마이징 - 천 단위 구분
  const customTooltipFormatter = (value) => {
    return formatNumber(value);
  };

  // data가 없을 때 예외 처리
  if (!data || data.length === 0) {
    return (
      <div>
        <div className="flex gap-2 mb-4 items-center">
          <button
            onClick={onPrev}
            className="px-2 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100"
            aria-label="이전"
          >
            &#8592;
          </button>
          <div className="relative">
            <span 
              className="font-semibold text-blue-700 cursor-pointer hover:text-blue-800 bg-blue-50 py-1 px-3 rounded-md border border-blue-200 shadow-sm"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              {dateInfo}
            </span>
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md p-3 z-10 date-picker-container">
                <div className="flex flex-col gap-2">
                  {datePickerProps}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onNext}
            className="px-2 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100"
            aria-label="다음"
            disabled={isNextDisabled}
          >
            &#8594;
          </button>
        </div>
        <div className="w-full py-10 text-center text-gray-500 text-lg bg-white rounded shadow">
          해당 기간에 매출이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 items-center">
        <button
          onClick={onPrev}
          className="px-2 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100"
          aria-label="이전"
        >
          &#8592;
        </button>
        
        {/* 클릭 가능한 날짜 영역 */}
        <div className="relative">
          <span 
            className="font-semibold text-blue-700 cursor-pointer hover:text-blue-800 bg-blue-50 py-1 px-3 rounded-md border border-blue-200 shadow-sm"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            {dateInfo}
          </span>
          
          {/* 날짜 선택기 */}
          {showDatePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md p-3 z-10 date-picker-container">
              <div className="flex flex-col gap-2">
                {datePickerProps}
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={onNext}
          className="px-2 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100"
          aria-label="다음"
          disabled={isNextDisabled}
        >
          &#8594;
        </button>
      </div>

      {/* 선택한 날짜의 매출 정보 표시 */}
      <div className="mb-5 p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
        <h3 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          {selectedDate} 매출 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md border border-blue-200 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">총 매출액</p>
              <p className="text-xl font-bold text-blue-700">{formatNumber(selectedData?.totalSales)}원</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border border-green-200 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">주문 건수</p>
              <p className="text-xl font-bold text-green-700">{formatNumber(selectedData?.orderCount)}건</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border border-yellow-200 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">주문 상품 수량</p>
              <p className="text-xl font-bold text-yellow-700">{formatNumber(selectedData?.itemCount)}개</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ left: 40, right: 20, top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="dateKey" 
              tickFormatter={formatXAxis}
            />
            <YAxis yAxisId="left" tickFormatter={formatNumberAndUnit} tick={{ fontSize: 12 }}/>
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip formatter={customTooltipFormatter} />
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
  );
};

export default BaseChart;