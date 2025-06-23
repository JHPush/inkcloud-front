import React, { useEffect, useState, useMemo } from "react";
import { getSalesStat } from "../../api/statsApi";
import BaseChart from "./BaseChart";
import { toDate, toStr, formatDayOnly } from "../../hooks/dateUtils";

const DAYS = 13; // 14일 구간(오늘 포함)

const DailyStats = () => {
  const todayStr = toStr(new Date());
  const [endDate, setEndDate] = useState(todayStr);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const startDate = useMemo(() => {
    const d = toDate(endDate);
    d.setDate(d.getDate() - DAYS);
    return toStr(d);
  }, [endDate]);

  const [data, setData] = useState([]);
  const [selectedDayData, setSelectedDayData] = useState(null);

  const movePrev = () => {
    const end = toDate(endDate);
    end.setDate(end.getDate() - 1);
    const newEndDate = toStr(end);
    setEndDate(newEndDate);
  };
  
  const moveNext = () => {
    if (endDate === todayStr) return;

    const end = toDate(endDate);
    end.setDate(end.getDate() + 1);
    
    const newEndDate = toStr(end);
    if (newEndDate <= todayStr) {
      setEndDate(newEndDate);
    } else {
      setEndDate(todayStr);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!startDate || !endDate) return;
        const result = await getSalesStat("daily", startDate, endDate);
        setData(result);
        
        // 선택된 날짜(endDate)의 데이터 찾기
        const endDateData = result.find(item => item.dateKey === endDate);
        setSelectedDayData(endDateData || null);
      } catch (e) {
        console.error("error:", e);
      }
    };
    fetch();
  }, [startDate, endDate]);

  // 날짜 선택기 UI
  const datePickerUI = (
    <>
      <input
        type="date"
        value={endDate}
        onChange={e => {
          const val = e.target.value;
          if (val > todayStr) return;
          setEndDate(val);
        }}
        className="border rounded px-2 py-1"
        max={todayStr}
      />
      <span className="text-xs text-gray-500">(이전 14일 구간 표시)</span>
    </>
  );

  return (
    <BaseChart
      data={data}
      formatXAxis={formatDayOnly}
      selectedData={selectedDayData}
      selectedDate={endDate}
      dateInfo={endDate}
      onPrev={movePrev}
      onNext={moveNext}
      onDateSelect={setEndDate}
      showDatePicker={showDatePicker}
      setShowDatePicker={setShowDatePicker}
      isNextDisabled={endDate === todayStr}
      datePickerProps={datePickerUI}
    />
  );
};

export default DailyStats;