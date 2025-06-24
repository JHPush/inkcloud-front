import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrdersByMember } from "../../api/paymentOrderApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import WriteReview from "../review/WriteReview";

const statusMapping = {
  PREPARE: "상품준비중",
  SHIPPING: "배송중",
  SHIPPED: "배송완료",
  CANCELED: "주문취소",
  FAILED: "주문오류",
};

const statusColorMapping = {
  PREPARE: "bg-yellow-100 text-yellow-800",
  SHIPPING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
  FAILED: "bg-red-100 text-red-800",
};

const MemberOrdersComp = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [sortBy] = useState("CREATED_AT");
  const [sortDir, setSortDir] = useState("DESC");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [dateFilterType, setDateFilterType] = useState("전체");
  const [filterState, setFilterState] = useState("ALL");

  // 날짜 필터 처리
  const handleDateFilter = (type) => {
    const today = new Date();
    let start = null, end = null;

    switch (type) {
      case "오늘":
        start = new Date(today.setHours(23, 59, 59, 999));
        end = new Date(today.setHours(23, 59, 59, 999));
        break;
      case "이번주":
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        start.setHours(0, 0, 0, 0);
        end = new Date();
        end.setHours(23, 59, 59, 999);
        break;
      case "이번달":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today)
        end.setHours(23, 59, 59, 999);
        break;
      case "올해":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today)
        end.setHours(23, 59, 59, 999);
        break;
      case "전체":
      default:
        start = end = null;
    }

    setDateFilterType(type);
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(0);
  };

  // 주문 데이터 가져오기
  const fetchOrders = async () => {
    const format = (d) => d?.toISOString().split("T")[0];
    try {
      const res = await getOrdersByMember(
        filterState,
        format(startDate),
        format(endDate),
        sortBy,
        sortDir,
        currentPage,
        pageSize
      );
      
      console.log('응답:', res);
      
      setOrders(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error("주문 데이터 요청 실패:", err);
      setOrders([]);
      setTotalPages(0);
      setTotalElements(0);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate, sortDir, currentPage, filterState]);

  // 페이지네이션 번호 생성 (최대 5개 페이지 버튼 표시)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 전체 페이지가 5개 초과일 때
      let startPage = Math.max(0, currentPage - 2);
      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
      
      // 끝에서 5개가 안되면 시작점 조정
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const getOrderDisplayId = (orderId) => {
    return orderId.split('-')[0].toUpperCase();
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">내 주문내역</h1>
        <div className="text-sm text-gray-600">
          총 <span className="font-semibold text-blue-600">{totalElements}</span>건의 주문
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        {/* 날짜 필터 버튼 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["전체", "오늘", "이번주", "이번달", "올해"].map((label) => (
            <button
              key={label}
              onClick={() => handleDateFilter(label)}
              className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
                dateFilterType === label
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 상세 필터 */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* 날짜 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">기간 선택:</span>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setDateFilterType("사용자정의");
                setCurrentPage(0);
              }}
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일"
              className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-gray-500">~</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                setDateFilterType("사용자정의");
                setCurrentPage(0);
              }}
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일"
              className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* 정렬 선택 */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">정렬:</label>
              <select
                id="sort"
                value={sortDir}
                onChange={(e) => {
                  setSortDir(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="DESC">최신순</option>
                <option value="ASC">오래된순</option>
              </select>
            </div>

            {/* 주문 상태 필터 */}
            <div className="flex items-center gap-2">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">주문 상태:</label>
              <select
                id="status"
                value={filterState}
                onChange={(e) => {
                  setFilterState(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="ALL">전체</option>
                <option value="PREPARE">상품준비중</option>
                <option value="SHIPPING">배송중</option>
                <option value="SHIPPED">배송완료</option>
                <option value="CANCELED">주문취소</option>
                <option value="FAILED">주문오류</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 주문 목록 */}
      <div className="space-y-6">
        {orders?.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <p className="text-xl text-gray-500 mb-2">주문 내역이 없습니다</p>
            <p className="text-gray-400">새로운 주문을 해보세요!</p>
          </div>
        ) : (
          orders?.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Link
                to={`/order/member/${order.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* 왼쪽 정보 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        주문번호: {getOrderDisplayId(order.id)}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColorMapping[order.state] || "bg-gray-100 text-gray-800"
                      }`}>
                        {statusMapping[order.state] || order.state}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {order.delegateProduct} {order.typesNum > 1 && (
                        <span className="ml-2">외 {order.typesNum - 1}종</span>
                      )}
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                      <span>주문일시: {formatDate(order.createdAt)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>주문자: {order.orderName?.trim()}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>받는사람: {order.receiver}</span>
                    </div>
                  </div>

                  {/* 오른쪽 가격 정보 */}
                  <div className="text-right lg:text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {order.price?.toLocaleString()}원
                    </div>
                    <div className="text-sm text-gray-600">
                      수량: {order.quantity}개
                      
                    </div>
                  </div>
                </div>
              </Link>

              {/* 배송완료 시 리뷰 작성 버튼 (필요시 주석 해제) */}
              {/* {order.state === "SHIPPED" && (
                <div className="px-6 pb-6">
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <WriteReview
                      productId={order.productId}
                      productName={order.delegateProduct}
                      onSuccess={fetchOrders}
                    />
                  </div>
                </div> 
              )} */}
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (

        <div className="flex items-center justify-center mt-12 space-x-1">
          {/* 이전 페이지 버튼 */}
          <button
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentPage === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            처음
          </button>
          {/* 이전 페이지 버튼 */}
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentPage === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            이전
          </button>

          {/* 페이지 번호 버튼들 */}
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {pageNum + 1}
            </button>
          ))}

          {/* 다음 페이지 버튼 */}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentPage >= totalPages - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            다음
          </button>
           <button
            onClick={() => setCurrentPage(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentPage >= totalPages - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            마지막
          </button>
        </div>
      )}

      {/* 페이지 정보 */}
      {totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          {currentPage + 1} / {totalPages} 페이지 (총 {totalElements}개 주문)
        </div>
      )}
    </div>
  );
};

export default MemberOrdersComp;