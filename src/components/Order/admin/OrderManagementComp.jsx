import { useEffect, useState } from "react";
import { getAllOrders, patchUpdateOrdersWithState, putCancelOrder } from "../../../api/paymentOrderApi";
import { Link } from "react-router-dom";

const OrderManagementComp = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 검색 필터 상태
  const [searchType, setSearchType] = useState("주문번호");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // 정렬 및 페이지네이션 상태
  const [sortBy, setSortBy] = useState("CREATED_AT");
  const [sortDir, setSortDir] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 선택된 주문들
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [stateType, setStateType] = useState("PREPARE");


  // 상태 매핑
  const stateMapping = {
    "PREPARE": "상품준비중",
    "SHIPPING": "배송중",
    "SHIPPED": "배송완료",
    "CANCELED": "주문 취소",
    "FAILED": "결제실패"
  };

  // 데이터 로드 함수
  const loadOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const stateParam = selectedStates.length > 0 ? selectedStates.join(",") : null;
      const paymentParam = selectedPaymentMethods.length > 0 ? selectedPaymentMethods.join(",") : null;

      const response = await getAllOrders(
        searchType === "주문번호" ? 'ID' : searchType,
        searchKeyword,
        stateParam,
        paymentParam,
        startDate,
        endDate,
        sortBy,
        sortDir,
        currentPage,
        pageSize
      );
      console.log(response)
      setOrders(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (e) {
      console.error('주문 조회 실패:', e);
      setError('주문 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize, sortBy, sortDir]);

  // 검색 처리
  const handleSearch = () => {
    setCurrentPage(0);
    loadOrders();
  };

  // 필터 초기화
  const handleReset = () => {
    setSearchKeyword("");
    setSelectedStates([]);
    setSelectedPaymentMethods([]);
    setStartDate("");
    setEndDate("");
    setCurrentPage(0);
  };

  // 상태 체크박스 변경
  const handleStateChange = (state) => {
    setSelectedStates(prev =>
      prev.includes(state)
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const handlePaymentChange = (state) => {
    setSelectedPaymentMethods(prev =>
      prev.includes(state)
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  // 날짜 단축버튼 처리
  const setDateRange = (type) => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    switch (type) {
      case '오늘':
        setStartDate(formatDate(today));
        setEndDate(formatDate(today));
        break;
      case '어제':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        setStartDate(formatDate(yesterday));
        setEndDate(formatDate(yesterday));
        break;
      case '이번달':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(formatDate(startOfMonth));
        setEndDate(formatDate(today));
        break;
      case '이전달':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        setStartDate(formatDate(lastMonth));
        setEndDate(formatDate(endOfLastMonth));
        break;
    }
  };

  // 정렬 처리
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortDir("DESC");
    }
    setCurrentPage(0);
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
    setSelectAll(!selectAll);
  };

  // 개별 선택
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // 페이지네이션
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 금액 포맷팅
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  // 총 금액 계산
  const totalAmount = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);

  const selectedOrdersAmount = orders
    .filter(order => selectedOrders.includes(order.id))
    .reduce((sum, order) => sum + (order.price * order.quantity), 0);

  const handleOnUpdateOrders = async () => {
    const res = await patchUpdateOrdersWithState(selectedOrders, stateType);
    if (res.length > 0) {
      setOrders(prev =>
        prev.map(order => {
          const updated = res.find(r => r.id === order.id);
          return updated ? updated : order;
        })
      );

      alert('상태가 반영되었습니다.')
    }
  }


  const handleOrderCancel = (id) => {
    const pickOrder = orders.find(item => item.id === id)
    if (pickOrder.state === 'CANCELED') {
      alert('이미 주문이 취소되었습니다')
      return
    }
    if (window.confirm('주문을 취소하겠습니까?'))
      putCancelOrder(id).then(data => {
        console.log('data : ', data)
        setOrders(prev =>
          prev.map(o => o.id === id ? data : o)
        );
        alert('주문이 취소되었습니다.')
      })
        .catch(e => {
          console.log("취소 실패:", e);
        });

  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">주문 관리</h1>

      {/* 필터 박스 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value={"ID"}>주문번호</option>
            <option value={"MEMBER_EMAIL"}>주문자 이메일</option>
            <option value={"MEMBER_NAME"}>주문자 이름</option>
            <option value={"RECEIVER"}>수령인</option>
          </select>
          <input
            type="text"
            placeholder="검색어 입력"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="border rounded px-3 py-2 w-52"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center mb-4">
          <label className="text-sm font-medium">주문 상태</label>
          {[
            { key: 'PREPARE', label: '상품준비중' },
            { key: 'SHIPPING', label: '배송중' },
            { key: 'SHIPPED', label: '배송완료' },
            { key: 'CANCELED', label: '주문 취소' }
          ].map(({ key, label }) => (
            <label key={key} className="text-sm">
              <input
                type="checkbox"
                className="mr-1"
                checked={selectedStates.includes(key)}
                onChange={() => handleStateChange(key)}
              />
              {label}
            </label>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <label className="text-sm font-medium">결제 방법</label>
          {[
            { key: 'CARD', label: '신용카드' },
            { key: 'KAKAOPAY', label: '카카오페이' },
            { key: 'NAVERPAY', label: '네이버페이' },
            { key: 'SAMSUNGPAY', label: '삼성페이' },
            { key: 'PAYCO', label: '페이코' },
          ].map(({ key, label }) => (
            <label key={key} className="text-sm">
              <input
                type="checkbox"
                className="mr-1"
                checked={selectedPaymentMethods.includes(key)}
                onChange={() => handlePaymentChange(key)}
              />
              {label}
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <label className="text-sm font-medium">주문 일자</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <span className="text-sm">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          {['오늘', '어제', '이번달', '이전달'].map((label) => (
            <button
              key={label}
              onClick={() => setDateRange(label)}
              className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 border text-gray-700"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            검색
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            다시쓰기
          </button>
        </div>
      </div>

      {/* 정렬 버튼 */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'CREATED_AT', label: '주문일자' },
          { key: 'PRICE', label: '주문가격' },
          { key: 'STATE', label: '주문상태' },
          { key: 'EMAIL', label: '주문자(이메일)' },
          { key: 'NAME', label: '주문자(이름)' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={`px-3 py-1 border rounded text-sm hover:bg-gray-100 ${sortBy === key ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
              }`}
          >
            {label} {sortBy === key && (sortDir === 'ASC' ? '↑' : '↓')}
          </button>
        ))}
      </div>

      {/* 로딩 및 에러 표시 */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 테이블 */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3">주문번호</th>
                <th className="p-3">주문상태</th>
                <th className="p-3">결제수단</th>
                <th className="p-3">주문자</th>
                <th className="p-3">주문자 전화</th>
                <th className="p-3">수령인</th>
                <th className="p-3">결제금액</th>
                <th className="p-3">주문일자</th>
                <th className="p-3">취소</th>
                <th className="p-3">보기</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </td>
                  <td className="p-3 text-center">{order.id}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${order.state === 'CANCELED' ? 'bg-red-100 text-red-800' :
                      order.state === 'SHIPPED' ? 'bg-green-100 text-green-800' :
                        order.state === 'SHIPPING' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {stateMapping[order.state] || order.state}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {order.method || '-'}
                  </td>
                  <td className="p-3 text-center">{order.member?.memberName || '-'}</td>
                  <td className="p-3 text-center">{order.member?.memberContact || '-'}</td>
                  <td className="p-3 text-center">{order.orderShip?.receiver || '-'}</td>
                  <td className="p-3 text-center">{formatPrice(order.price * order.quantity)}원</td>
                  <td className="p-3 text-center">{formatDate(order.createdAt)}</td>
                  {order.state !== 'CANCELED' ? <td onClick={() => handleOrderCancel(order.id)} className="p-3 text-center text-red-500 cursor-pointer hover:underline">
                    주문취소
                  </td> : <td className="p-3 text-center text-gray-500">
                    취소됨
                  </td>}
                  <td className="p-3 text-center">
                    <Link
                      to={`/order/member/${order.id}`}
                      className="text-blue-500 cursor-pointer hover:underline"
                    >
                      보기
                    </Link>
                  </td>

                </tr>
              )) : (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-gray-500">
                    주문 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 총합계 */}
          <div className="flex justify-end items-center p-4 text-sm border-t">
            <span className="mr-4">건수: {selectedOrders.length}건</span>
            <span className="mr-4">금액: {formatPrice(selectedOrdersAmount)}원</span>
          </div>
        </div>
      )}

      {/* 상태 변경 영역 */}
      <div className="text-sm text-gray-600 mt-6">
        <p className="mb-2">※ 주문상태 : 결제완료 &gt; 상품준비중 &gt; 배송중 &gt; 배송완료</p>
        {/* <div className="flex items-center gap-2">
          <span>선택한 주문의 상태를 다음 상태로 변경합니다:</span>
          <select className="border rounded px-3 py-1">
            <option value="PREPARE">상품준비중</option>
            <option value="SHIPPING">배송중</option>
            <option value="SHIPPED">배송완료</option>
            <option value="CANCELED">주문 취소</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-1 rounded">
            변경 ({selectedOrders.length}건)
          </button>
        </div> */}
        <div className="flex items-center gap-2">
          <span>선택한 주문의 상태를 해당 상태로 변경합니다:</span>
          <select value={stateType}
            onChange={(e) => setStateType(e.target.value)}
            className="border rounded px-3 py-1">
            <option value="PREPARE">상품준비중</option>
            <option value="SHIPPING">배송중</option>
            <option value="SHIPPED">배송완료</option>
            {/* <option value="CANCELED">주문 취소</option> */}
          </select>
          <button onClick={handleOnUpdateOrders} type="button" className="bg-blue-500 text-white px-4 py-1 rounded">
            변경 ({selectedOrders.length}건)
          </button>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-center items-center gap-2 text-sm">
        <button
          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt; Prev
        </button>

        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
          const pageNum = Math.floor(currentPage / 10) * 10 + i;
          if (pageNum >= totalPages) return null;

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 border rounded hover:bg-gray-100 ${currentPage === pageNum ? 'bg-blue-100 text-blue-700' : ''
                }`}
            >
              {pageNum + 1}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next &gt;
        </button>

        {/* <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(0);
          }}
          className="ml-4 border rounded px-2 py-1"
        >
          <option value={20}>20개</option>
          <option value={50}>50개</option>
          <option value={100}>100개</option>
        </select> */}
      </div>
    </div>
  );
};

export default OrderManagementComp;