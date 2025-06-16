import React, { useEffect, useState, useMemo } from "react";
import { getSalesStat } from "../../api/statsApi";
import BaseChart from "./BaseChart";
import { toDate, toStr } from "../../hooks/dateUtils";

// 주간 매출은 10주 표시
const WEEKS = 9;

// 주차 계산 함수 (ISO 8601 형식으로)
const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7); // 목요일 기준
  const week1 = new Date(d.getFullYear(), 0, 4); // 1월 4일이 있는 주가 1주차
  const weekNum = Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7) + 1;
  return weekNum;
};

// ISO 8601 형식의 주차 문자열 반환 (yyyy-Www)
const getWeekString = (date) => {
  const year = date.getFullYear();
  const weekNum = getWeekNumber(date);
  return `${year}-W${String(weekNum).padStart(2, '0')}`;
};

// 주차 문자열에서 날짜 객체로 변환 (간략화 버전)
const getDateFromWeekString = (weekString) => {
  const [year, weekPart] = weekString.split('-');
  const weekNum = parseInt(weekPart.substring(1), 10);
  
  // 해당 연도의 1월 1일 날짜 객체 생성
  const firstDay = new Date(parseInt(year, 10), 0, 1);
  
  // 해당 연도의 1월 1일의 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const dayOfWeek = firstDay.getDay();
  
  // 첫번째 주의 월요일까지의 오프셋 계산
  const firstMonday = dayOfWeek <= 1 ? 1 - dayOfWeek : 8 - dayOfWeek;
  
  // 주어진 주차의 월요일 계산
  const targetMonday = new Date(parseInt(year, 10), 0, firstMonday + (weekNum - 1) * 7);
  
  // 주어진 주차의 일요일(주의 마지막 날)
  const targetSunday = new Date(targetMonday);
  targetSunday.setDate(targetMonday.getDate() + 6);
  
  return targetSunday;
};

// 같은 주에 속하는지 확인하는 함수
const isSameWeek = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // 각 날짜의 연도
  const y1 = d1.getFullYear();
  const y2 = d2.getFullYear();
  
  // 각 날짜의 주차
  const w1 = getWeekNumber(d1);
  const w2 = getWeekNumber(d2);
  
  return y1 === y2 && w1 === w2;
};

const WeeklyStats = () => {
  const today = new Date();
  
  // 현재 주의 일요일 계산
  const currentWeekEnd = new Date(today);
  const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
  const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // 이번 주 일요일까지 남은 일수
  currentWeekEnd.setDate(today.getDate() + diff);
  
  // 주의 종료일 문자열
  const todayEndStr = toStr(currentWeekEnd);
  
  const [endDate, setEndDate] = useState(todayEndStr);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // 선택된 주의 시작일 계산
  const startDate = useMemo(() => {
    const weekEnd = toDate(endDate);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - WEEKS * 7);
    return toStr(weekStart);
  }, [endDate]);

  // 현재 주의 표시 형식
  const currentWeekDisplay = useMemo(() => {
    const end = toDate(endDate);
    const start = new Date(end);
    start.setDate(end.getDate() - 6); // 일요일에서 6일 전이 월요일
    return `${toStr(start)} ~ ${endDate}`;
  }, [endDate]);

  const [data, setData] = useState([]);
  const [selectedWeekData, setSelectedWeekData] = useState(null);

  const movePrev = () => {
    const end = toDate(endDate);
    end.setDate(end.getDate() - 7);
    setEndDate(toStr(end));
  };
  
  const moveNext = () => {
    if (endDate === todayEndStr) return;

    const end = toDate(endDate);
    end.setDate(end.getDate() + 7);
    
    const newEndDate = toStr(end);
    if (newEndDate <= todayEndStr) {
      setEndDate(newEndDate);
    } else {
      setEndDate(todayEndStr);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!startDate || !endDate) return;
        // console.log("Fetching data for:", startDate, "to", endDate);
        let result = await getSalesStat("weekly", startDate, endDate);
        
        // API가 빈 배열을 반환할 경우 더미 데이터 생성 (테스트 및 디버깅용)
        // if (!result || result.length === 0) {
        //   console.warn("API returned no data, using dummy data");
        //   const dummyWeeks = [];
        //   const endDateObj = toDate(endDate);
          
        //   // 마지막 주부터 이전 10주까지 더미 데이터 생성
        //   for (let i = 0; i < 10; i++) {
        //     const weekEndDate = new Date(endDateObj);
        //     weekEndDate.setDate(endDateObj.getDate() - (7 * i));
        //     const weekStartDate = new Date(weekEndDate);
        //     weekStartDate.setDate(weekEndDate.getDate() - 6);
            
        //     dummyWeeks.unshift({
        //       dateKey: toStr(weekEndDate), // 주의 마지막 날
        //       totalSales: Math.floor(Math.random() * 1000000) + 500000,
        //       orderCount: Math.floor(Math.random() * 100) + 50,
        //       itemCount: Math.floor(Math.random() * 200) + 100,
        //       // 주 표시용 추가 필드
        //       weekStart: toStr(weekStartDate),
        //       weekEnd: toStr(weekEndDate)
        //     });
        //   }
        //   result = dummyWeeks;
        // }
        
        // 데이터 처리 - X축 날짜 포맷팅
        const processedData = result.map(item => {
          const newItem = { ...item }; // 원본 데이터 복사하여 보존
          
          if (newItem.dateKey) {
            // 데이터에 월/일 형식 추가
            const parts = newItem.dateKey.split('-');
            if (parts.length === 3) {
              newItem.displayDate = `${parts[1]}/${parts[2]}`;
            }
            
            // 주 시작일과 종료일 계산 (이미 있지 않다면)
            if (!newItem.weekStart || !newItem.weekEnd) {
              const itemDate = toDate(newItem.dateKey);
              const weekEnd = new Date(itemDate);
              
              // dateKey가 주의 마지막 날이 아닐 수 있으므로 해당 주의 일요일을 찾음
              const dayOfWeek = itemDate.getDay();
              if (dayOfWeek < 6) {
                weekEnd.setDate(itemDate.getDate() + (6 - dayOfWeek));
              }
              
              const weekStart = new Date(weekEnd);
              weekStart.setDate(weekEnd.getDate() - 6);
              
              newItem.weekStart = toStr(weekStart);
              newItem.weekEnd = toStr(weekEnd);
            }
          }
          return newItem;
        });
        
        // console.log("Processed data:", processedData);
        setData(processedData);
        
        // 선택된 주의 데이터 찾기
        let weekData = null;
        
        // 첫 번째 방법: endDate와 정확히 일치하는 항목 찾기
        weekData = processedData.find(item => item.dateKey === endDate);
        
        // 두 번째 방법: 같은 주에 속하는 항목 찾기
        if (!weekData) {
          weekData = processedData.find(item => {
            // 항목에 weekStart와 weekEnd가 있는 경우
            if (item.weekStart && item.weekEnd) {
              return endDate >= item.weekStart && endDate <= item.weekEnd;
            }
            
            // 없는 경우 isSameWeek 함수로 확인
            return isSameWeek(toDate(item.dateKey), toDate(endDate));
          });
        }
        
        // 세 번째 방법: 가장 가까운 날짜의 항목 찾기
        if (!weekData && processedData.length > 0) {
          const endDateObj = toDate(endDate);
          const endDateTime = endDateObj.getTime();
          
          let closestItem = processedData[0];
          let minDiff = Math.abs(toDate(closestItem.dateKey).getTime() - endDateTime);
          
          processedData.forEach(item => {
            const itemTime = toDate(item.dateKey).getTime();
            const diff = Math.abs(itemTime - endDateTime);
            
            if (diff < minDiff) {
              minDiff = diff;
              closestItem = item;
            }
          });
          
          weekData = closestItem;
        }
        
        // 네 번째 방법: 마지막 항목 사용 (최후의 수단)
        if (!weekData && processedData.length > 0) {
          weekData = processedData[processedData.length - 1];
        }
        
        // console.log("Selected week data:", weekData);
        setSelectedWeekData(weekData);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    fetch();
  }, [startDate, endDate]);

  // 현재 주차 계산
  const currentWeek = useMemo(() => {
    const endDateObj = toDate(endDate);
    return getWeekString(endDateObj);
  }, [endDate]);

  // 주 선택기
  const weekPickerUI = (
    <>
      <input
        type="week"
        value={currentWeek}
        onChange={e => {
          const weekString = e.target.value;
          if (!weekString) return;
          
          try {
            // 주차 문자열에서 날짜 객체로 변환
            const selectedSunday = getDateFromWeekString(weekString);
            const selectedSundayStr = toStr(selectedSunday);
            
            if (selectedSundayStr > todayEndStr) return;
            setEndDate(selectedSundayStr);
          } catch (err) {
            console.error("Invalid week format:", err);
          }
        }}
        className="border rounded px-2 py-1"
        max={getWeekString(currentWeekEnd)}
      />
      <span className="text-xs text-gray-500">(선택한 주 기준 이전 10주 구간 표시)</span>
    </>
  );

  // X축 날짜 포맷팅 함수 수정
  const formatWeeklyXAxis = (dateStr) => {
    if (!dateStr) return '';
    
    // 이미 처리된 displayDate가 있으면 사용
    const item = data.find(d => d.dateKey === dateStr);
    if (item && item.displayDate) return item.displayDate;
    
    // 없으면 기본 포매팅 사용
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}`; // MM/DD 형식
    }
    return dateStr;
  };

//   // 디버깅을 위한 로그 추가
//   console.log("Current endDate:", endDate);
//   console.log("Current week display:", currentWeekDisplay);
//   console.log("Selected week data:", selectedWeekData);

  // 선택된 주에 대한 기본 데이터 생성 (API 응답이 없는 경우)
  const defaultWeekData = useMemo(() => {
    if (selectedWeekData) return selectedWeekData;
    
    return {
      totalSales: 0,
      orderCount: 0,
      itemCount: 0,
      dateKey: endDate
    };
  }, [selectedWeekData, endDate]);

  return (
    <BaseChart
      data={data}
      formatXAxis={formatWeeklyXAxis}
      selectedData={defaultWeekData} // 항상 값이 있도록 보장
      selectedDate={currentWeekDisplay}
      dateInfo={currentWeekDisplay}
      onPrev={movePrev}
      onNext={moveNext}
      onDateSelect={setEndDate}
      showDatePicker={showDatePicker}
      setShowDatePicker={setShowDatePicker}
      isNextDisabled={endDate === todayEndStr}
      datePickerProps={weekPickerUI}
    />
  );
};

export default WeeklyStats;