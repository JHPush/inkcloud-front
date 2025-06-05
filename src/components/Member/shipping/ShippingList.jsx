import { useEffect, useState } from "react";
import { deleteShip, getShipList } from "../../../api/shipApi";
import { useNavigate } from "react-router-dom";

const ShippingList = () => {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">배송지 목록</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button onClick={()=>{navigate('/mypage/add-shipping')}}>배송지 등록</button>
      <ul className="space-y-2">
        {list.length === 0 && !error && (
          <li className="text-gray-400">등록된 배송지가 없습니다.</li>
        )}
        {list.map((ship) => (
          <li key={ship.id} className="p-3 border rounded">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{ship.name}</span>
              <div className="flex gap-2">
                <button
                  className="btn btn-xs btn-outline"
                  onClick={() => navigate(`/mypage/modify/${ship.id}`)}
                >
                  수정
                </button>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => handleDelete(ship.id)}
                >
                  삭제
                </button>
              </div>
            </div>
            <div>수령인: {ship.receiver}</div>
            <div>
              {ship.addressMain} {ship.addressSub} ({ship.zipcode})
            </div>
            <div>연락처: {ship.contact}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShippingList;