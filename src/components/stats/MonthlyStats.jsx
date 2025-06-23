import React, { useEffect, useState, useMemo } from "react";
import { getSalesStat } from "../../api/statsApi";
import BaseChart from "./BaseChart";
import { toDate, toStr, formatYearMonth } from "../../hooks/dateUtils";

// 월간 매출은 12개월 표시
const MONTHS = 12;

const MonthlyStats = () => {
  // 현재 월의 마지막 날짜
  const today = new Date();
  const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const currentMonthEndStr = toStr(currentMonthEnd);
  
  const [endDate, setEndDate] = useState(currentMonthEndStr);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // 시작일은 12개월 전의 첫날
  const startDate = useMemo(() => {
    const d = toDate(endDate);
    const startMonth = new Date(d.getFullYear(), d.getMonth() - MONTHS + 1, 1);
    return toStr(startMonth);
  }, [endDate]);

  // 현재 월 표시 형식 (YYYY-MM)
  const currentMonthDisplay = useMemo(() => {
    const date = toDate(endDate);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }, [endDate]);

  const [data, setData] = useState([]);
  const [selectedMonthData, setSelectedMonthData] = useState(null);

  const movePrev = () => {
    const end = toDate(endDate);
    // 이전 월의 마지막 날짜로 이동
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    setEndDate(toStr(prevMonth));
  };
  
  const moveNext = () => {
    if (endDate === currentMonthEndStr) return;

    const end = toDate(endDate);
    // 다음 월의 마지막 날짜로 이동
    const nextMonth = new Date(end.getFullYear(), end.getMonth() + 2, 0);
    
    const newEndDate = toStr(nextMonth);
    if (newEndDate <= currentMonthEndStr) {
      setEndDate(newEndDate);
    } else {
      setEndDate(currentMonthEndStr);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!startDate || !endDate) return;
        const result = await getSalesStat("monthly", startDate, endDate);
        console.log(result)
        setData(result);
        
        // 선택된 달의 데이터 찾기
        // 월 데이터는 yearMonth 형식으로 저장되어있다고 가정 (예: "2023-01")
        const monthKey = currentMonthDisplay;
        const monthData = result.find(item => item.dateKey.startsWith(monthKey)) || null;
        setSelectedMonthData(monthData);
      } catch (e) {
        console.error("error:", e);
      }
    };
    fetch();
  }, [startDate, endDate, currentMonthDisplay]);

  // 월 선택기
  const monthPickerUI = (
    <>
      <input
        type="month"
        value={currentMonthDisplay}
        onChange={e => {
          const val = e.target.value;
          const [year, month] = val.split('-').map(Number);
          
          // 선택한 월의 마지막 날짜
          const lastDay = new Date(year, month, 0);
          const newEndDate = toStr(lastDay);
          
          if (newEndDate > currentMonthEndStr) return;
          setEndDate(newEndDate);
        }}
        className="border rounded px-2 py-1"
        max={`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`}
      />
      <span className="text-xs text-gray-500">(이전 12개월 표시)</span>
    </>
  );

  return (
    <BaseChart
      data={data}
      formatXAxis={formatYearMonth}
      selectedData={selectedMonthData}
      selectedDate={currentMonthDisplay}
      dateInfo={currentMonthDisplay}
      onPrev={movePrev}
      onNext={moveNext}
      showDatePicker={showDatePicker}
      setShowDatePicker={setShowDatePicker}
      isNextDisabled={endDate === currentMonthEndStr}
      datePickerProps={monthPickerUI}
    />
  );
};

export default MonthlyStats;