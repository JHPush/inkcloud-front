import { useState } from "react";

const OrderManagementComp = ()=>{
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">주문 관리</h1>

      {/* 필터 박스 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <select className="border rounded px-3 py-2">
            <option>주문번호</option>
            <option>주문자</option>
            <option>주문자 전화</option>
            <option>수령인</option>
          </select>
          <input type="text" placeholder="검색어 입력" className="border rounded px-3 py-2 w-52" />
          <select className="border rounded px-3 py-2">
            <option>AND</option>
            <option>OR</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-4 items-center mb-4">
          <label className="text-sm font-medium">주문 상태</label>
          {['결제', '상품준비중', '배송중', '주문 취소'].map((label) => (
            <label key={label} className="text-sm"><input type="checkbox" className="mr-1" />{label}</label>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-center mb-4">
          <label className="text-sm font-medium">결제 수단</label>
          {['무통장', '신용카드', '카카오페이'].map((label) => (
            <label key={label} className="text-sm"><input type="checkbox" className="mr-1" />{label}</label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <label className="text-sm font-medium">주문 일자</label>
          <input type="date" className="border rounded px-3 py-2" />
          <span className="text-sm">~</span>
          <input type="date" className="border rounded px-3 py-2" />
          {['오늘', '어제', '이번달', '이전달'].map((label) => (
            <button key={label} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 border text-gray-700">{label}</button>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">검색</button>
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">다시쓰기</button>
        </div>
      </div>

      {/* 정렬 버튼 */}
      <div className="flex gap-2 mb-4">
        {['주문번호', '결제일자', '결제수단', '수령인', '주문자(전화)'].map((label) => (
          <button key={label} className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100">{label}</button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">주문번호</th>
              <th className="p-3">주문상태</th>
              <th className="p-3">결제수단</th>
              <th className="p-3">주문자</th>
              <th className="p-3">주문자 전화</th>
              <th className="p-3">수령인</th>
              <th className="p-3">결제금액</th>
              <th className="p-3">주문취소</th>
              <th className="p-3">보기</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-3 text-center"><input type="checkbox" /></td>
                <td className="p-3 text-center">2024-09-02-32</td>
                <td className="p-3 text-center">주문 취소</td>
                <td className="p-3 text-center">카카오페이</td>
                <td className="p-3 text-center">박지호</td>
                <td className="p-3 text-center">010-2432-2433</td>
                <td className="p-3 text-center">박지호</td>
                <td className="p-3 text-center">243,000</td>
                <td className="p-3 text-center text-red-500">취소</td>
                <td className="p-3 text-center text-blue-500 cursor-pointer hover:underline">보기</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 총합계 */}
        <div className="flex justify-end items-center p-4 text-sm border-t">
          <span className="mr-4">총건수: 4건</span>
          <span>합계: 713,000원</span>
        </div>
      </div>

      {/* 상태 변경 영역 */}
      <div className="text-sm text-gray-600 mt-6">
        <p className="mb-2">※ 주문상태 : 결제완료 &gt; 상품준비중 &gt; 배송중 &gt; 배송완료</p>
        <div className="flex items-center gap-2">
          <span>선택한 주문의 상태를 다음 상태로 변경합니다:</span>
          <select className="border rounded px-3 py-1">
            <option>결제</option>
            <option>상품준비중</option>
            <option>배송중</option>
            <option>주문 취소</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-1 rounded">변경</button>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-center items-center gap-2 text-sm">
        <button className="px-3 py-1 border rounded">&lt; Prev</button>
        {[1,2,3,4,5,6,7,8,9,10].map(p => (
          <button key={p} className="px-3 py-1 border rounded hover:bg-gray-100">{p}</button>
        ))}
        <button className="px-3 py-1 border rounded">Next &gt;</button>
        <select className="ml-4 border rounded px-2 py-1">
          <option>20개</option>
          <option>50개</option>
          <option>100개</option>
        </select>
      </div>
    </div>
  );
}

export default OrderManagementComp;