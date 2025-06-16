// import React, { useEffect, useState, useMemo } from "react";
// import { getSalesStat } from "../../api/statsApi";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
// import AdminLayout from "../../layouts/AdminLayout";

// const TYPE_OPTIONS = [
//   { key: "daily", label: "일간 매출" },
//   { key: "weekly", label: "주간 매출" },
//   { key: "monthly", label: "월간 매출" },
// ];

// // YYYY-MM-DD 문자열 반환
// function toDate(str) {
//   const [year, month, day] = str.split('-').map(Number);
//   return new Date(year, month - 1, day); // month is 0-based in JavaScript Date
// }

// // YYYY-MM-DD 문자열 반환 (타임존 안전하게)
// function toStr(date) {
//   if (typeof date === 'string') return date;
  
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
  
//   return `${year}-${month}-${day}`;
// }

// const DAYS = 13; // 14일 구간(오늘 포함)

// const SalesStatsChart = () => {
//   const todayStr = toStr(new Date());
//   const [endDate, setEndDate] = useState(todayStr);
//   const [showDatePicker, setShowDatePicker] = useState(false);
  
//   const startDate = useMemo(() => {
//     const d = toDate(endDate);
//     d.setDate(d.getDate() - DAYS);
//     return toStr(d);
//   }, [endDate]);

//   const [type, setType] = useState("daily");
//   const [data, setData] = useState([]);
//   const [selectedDayData, setSelectedDayData] = useState(null);

//   const movePrev = () => {
//     const end = toDate(endDate);
//     end.setDate(end.getDate() - 1);
//     const newEndDate = toStr(end);
//     setEndDate(newEndDate);
//   };
  
//   const moveNext = () => {
//     if (endDate === todayStr) return;

//     const end = toDate(endDate);
//     end.setDate(end.getDate() + 1);
    
//     const newEndDate = toStr(end);
//     if (newEndDate <= todayStr) {
//       setEndDate(newEndDate);
//     } else {
//       setEndDate(todayStr);
//     }
//   };

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         if (!startDate || !endDate) return;
//         const result = await getSalesStat(type, startDate, endDate);
//         setData(result);
        
//         // 선택된 날짜(endDate)의 데이터 찾기
//         const endDateData = result.find(item => item.dateKey === endDate);
//         setSelectedDayData(endDateData || null);
//       } catch (e) {
//         console.error("error:", e);
//       }
//     };
//     fetch();
//   }, [type, startDate, endDate]);

//   // 날짜 선택기 외부 클릭 시 닫기
//   useEffect(() => {
//     if (!showDatePicker) return;
    
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.date-picker-container')) {
//         setShowDatePicker(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showDatePicker]);

//   // 숫자 포맷팅 함수
//   const formatNumber = (num) => {
//     return new Intl.NumberFormat('ko-KR').format(num);
//   };

//   // // X축 날짜 포맷팅 함수 - 일자만 표시
//   // const formatXAxis = (dateStr) => {
//   //   if (!dateStr) return '';
//   //   const day = dateStr.split('-')[2];
//   //   return day; // 일자만 반환 (예: "01", "15", "31")
//   // };

//   return (
//     <AdminLayout>
//       <div>
//         <div className="flex gap-2 mb-4 items-center">
//           {TYPE_OPTIONS.map((opt) => (
//             <button
//               key={opt.key}
//               onClick={() => setType(opt.key)}
//               className={`px-4 py-2 rounded-full font-semibold border transition ${
//                 type === opt.key
//                   ? "bg-blue-600 text-white border-blue-600"
//                   : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
//               }`}
//             >
//               {opt.label}
//             </button>
//           ))}
//           <button
//             onClick={movePrev}
//             className="px-2 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100"
//             aria-label="이전"
//           >
//             &#8592;
//           </button>
          
//           {/* 클릭 가능한 날짜 영역 - endDate만 표시하고 강조 */}
//           <div className="relative">
//             <span 
//               className="font-semibold text-blue-700 cursor-pointer hover:text-blue-800 bg-blue-50 py-1 px-3 rounded-md border border-blue-200 shadow-sm"
//               onClick={() => setShowDatePicker(!showDatePicker)}
//             >
//               {endDate}
//             </span>
            
//             {/* 날짜 선택기 */}
//             {showDatePicker && (
//               <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md p-3 z-10 date-picker-container">
//                 <div className="flex flex-col gap-2">
//                   <input
//                     type="date"
//                     value={endDate}
//                     onChange={e => {
//                       const val = e.target.value;
//                       if (val > todayStr) return;
//                       setEndDate(val);
//                     }}
//                     className="border rounded px-2 py-1"
//                     max={todayStr}
//                   />
//                   <span className="text-xs text-gray-500">(선택일 기준 이전 14일 구간 표시)</span>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <button
//             onClick={moveNext}
//             className="px-2 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100"
//             aria-label="다음"
//             disabled={endDate === todayStr}
//           >
//             &#8594;
//           </button>
//         </div>

//         {/* 선택한 날짜의 매출 정보 표시 (항상 표시됨) */}
//         <div className="mb-5 p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
//           <h3 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
//             <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
//             {endDate} 매출 정보
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white p-4 rounded-md border border-blue-200 shadow-sm hover:shadow-md transition-shadow flex items-center">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">총 매출액</p>
//                 <p className="text-xl font-bold text-blue-700">{formatNumber(selectedDayData?.totalSales || 0)}원</p>
//               </div>
//             </div>
//             <div className="bg-white p-4 rounded-md border border-green-200 shadow-sm hover:shadow-md transition-shadow flex items-center">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">주문 건수</p>
//                 <p className="text-xl font-bold text-green-700">{formatNumber(selectedDayData?.orderCount || 0)}건</p>
//               </div>
//             </div>
//             <div className="bg-white p-4 rounded-md border border-yellow-200 shadow-sm hover:shadow-md transition-shadow flex items-center">
//               <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">주문 상품 수량</p>
//                 <p className="text-xl font-bold text-yellow-700">{formatNumber(selectedDayData?.itemCount || 0)}개</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div style={{ width: "100%", height: 350 }}>
//           <ResponsiveContainer>
//             <LineChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="dateKey"  />
//               <YAxis yAxisId="left" />
//               <YAxis yAxisId="right" orientation="right" />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="totalSales"
//                 name="매출액"
//                 stroke="#8884d8"
//                 yAxisId="left"
//               />
//               <Line
//                 type="monotone"
//                 dataKey="orderCount"
//                 name="주문건수"
//                 stroke="#82ca9d"
//                 yAxisId="right"
//               />
//               <Line
//                 type="monotone"
//                 dataKey="itemCount"
//                 name="주문상품수량"
//                 stroke="#ffc658"
//                 yAxisId="right"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default SalesStatsChart;