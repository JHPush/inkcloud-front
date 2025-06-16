// 날짜 유틸리티 함수들

// YYYY-MM-DD 문자열로 Date 객체 생성
export function toDate(str) {
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-based in JavaScript Date
}

// Date 객체를 YYYY-MM-DD 문자열로 변환
export function toStr(date) {
  if (typeof date === 'string') return date;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// X축 날짜 포맷팅 함수 - 일자만 표시
export function formatDayOnly(dateStr) {
  if (!dateStr) return '';
  const day = dateStr.split('-')[2];
  return day; // 일자만 반환 (예: "01", "15", "31")
}

// X축 날짜 포맷팅 함수 - 월/일 표시 (주간용)
export function formatMonthDay(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return `${parts[1]}/${parts[2]}`; // 월/일 반환 (예: "01/15")
}

// X축 날짜 포맷팅 함수 - 년/월 표시 (월간용)
export function formatYearMonth(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return `${parts[0]}.${parts[1]}`; // 년.월 반환 (예: "2023.01")
}

// 숫자 포맷팅 함수
export function formatNumber(num) {
  return new Intl.NumberFormat('ko-KR').format(num || 0);
}