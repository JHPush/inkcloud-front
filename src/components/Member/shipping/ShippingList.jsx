import { useState, useEffect } from "react";
import { deleteShip, getShipList } from "../../../api/shipApi";
import AddShipping from "./AddShipping";
import ModifyShipping from "./ModifyShipping";

const ShippingList = () => {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editId, setEditId] = useState(null);

  //배송지 리스트 
  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await getShipList();
        setList(data);
      } catch (err) {
        setError("배송지 정보를 불러오지 못했습니다.");
      }
    };
    fetchList();
  }, []);

  //배송지 삭제 
  const handleDelete = async (id)=>{
    if(!window.confirm("배송지를 삭제하시겠습니까?")) return;
    try{
        await deleteShip(id);
        setList(list.filter(ship => ship.id !== id));
    }catch (err) {
        console.log("배송지 삭제 실패:", err)
    }
  }

  // 폼 제출 후 목록 새로고침
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditForm(null);
    setEditId(null);
    getShipList().then(setList);
  };

  if (showForm) {
    return (
      <AddShipping onSuccess={handleFormSuccess} />
    );
  }

  if (editId) {
    return (
      <ModifyShipping id={editId} onSuccess={handleFormSuccess} />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">배송지 목록</h2>
        <button
          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition shadow-sm"
          onClick={() => { setShowForm(true); setEditForm(null); setEditId(null); }}
        >
          + 배송지 등록
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ul className="space-y-4">
        {list.length === 0 && !error && (
          <li className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm min-h-[30vh]">
            <svg
              className="w-16 h-16 mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.364 17.364A9 9 0 1 1 17.364 15.364M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0"
              />
            </svg>
            <div className="text-lg text-gray-500 font-semibold mb-2">
              등록된 배송지가 없습니다.
            </div>
            <div className="text-sm text-gray-400">
              배송지를 등록하고 편리하게 주문하세요.
            </div>
          </li>
        )}
        {list.map((ship) => (
          <li
            key={ship.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-blue-700">{ship.name}</span>
              <div className="flex gap-2">
                <button
                  className="px-4 py-1 rounded-lg border border-blue-400 bg-white text-blue-600 font-semibold text-sm hover:bg-blue-50 transition"
                  onClick={() => { setEditId(ship.id); setShowForm(false); }}
                >
                  수정
                </button>
                <button
                  className="px-4 py-1 rounded-lg border border-red-300 bg-white text-red-500 font-semibold text-sm hover:bg-red-50 transition"
                  onClick={() => handleDelete(ship.id)}
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">수령인:</span> {ship.receiver}
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">주소:</span> {ship.addressMain} {ship.addressSub} ({ship.zipcode})
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">연락처:</span> {ship.contact}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShippingList;