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

const MemberOrdersComp = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [sortBy] = useState("CREATED_AT");
  const [sortDir, setSortDir] = useState("DESC");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [dateFilterType, setDateFilterType] = useState("전체");

  const [filterState, setFilterState] = useState("ALL");

  const handleDateFilter = (type) => {
    const today = new Date();
    let start = null, end = null;

    switch (type) {
      case "오늘":
        start = end = today;
        break;
      case "이번주":
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        end = new Date();
        break;
      case "이번달":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "올해":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case "전체":
      default:
        start = end = null;
    }

    setDateFilterType(type);
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(0); // 필터 바뀌면 페이지 리셋
  };

  useEffect(() => {
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
        setOrders(res.content);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error("주문 데이터 요청 실패:", err);
      }
    };


    fetchOrders();
  }, [startDate, endDate, sortDir, currentPage, filterState]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">내 주문내역</h1>

      {/* 필터 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {["전체", "오늘", "이번주", "이번달", "올해"].map((label) => (
            <button
              key={label}
              onClick={() => handleDateFilter(label)}
              className={`px-3 py-1 border rounded-full text-sm ${dateFilterType === label
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">기간 선택:</span>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="시작일"
            className="border px-2 py-1 rounded text-sm"
          />
          <span className="text-sm text-gray-500">~</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="종료일"
            className="border px-2 py-1 rounded text-sm"
          />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          {/* 정렬 드롭다운 */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600">정렬:</label>
            <select
              id="sort"
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value)}
              className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DESC">최신순</option>
              <option value="ASC">오래된순</option>
            </select>
          </div>

          {/* 주문 상태 드롭다운 */}
          <div className="flex items-center gap-2">
            <label htmlFor="status" className="text-sm text-gray-600">주문 상태:</label>
            <select
              id="status"
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* 주문 목록 */}
      <div className="space-y-4">
        {orders?.length === 0 ? (
          <p className="text-center text-gray-500 py-10">주문 내역이 없습니다.</p>
        ) : (
          orders?.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl bg-white p-6 hover:shadow-md transition"
            >
              {/* 주문 카드 내용 전체를 div로 감쌈 */}
              <Link
                to={`/order/member/${order.id}`}
                className="block"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      주문일시: {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-lg font-semibold mt-1">
                      주문번호: {order.id}
                    </p>
                    <p className="text-sm mt-1 text-gray-700">
                      주문자: {order.orderName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-medium">
                      총액: {order.price?.toLocaleString()}원 / 수량: {order.quantity}
                    </p>
                    <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {statusMapping[order.state] || order.state}
                    </span>
                  </div>
                </div>
              </Link>
              {/* SHIPPED 상태일 때 리뷰작성 버튼 - 카드 하단 오른쪽 정렬
              {order.state === "SHIPPED" && (
                <div className="flex justify-end mt-4">
                  <WriteReview
                    productId={order.productId}
                    productName={order.productName}
                    onSuccess={fetchOrders}
                  />
                </div>
              )} */}
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <div className="flex justify-center mt-10 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`px-3 py-1 border rounded text-sm ${currentPage === index
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberOrdersComp;
