import { useState } from "react";

export default function useCheckBox(items, key = "email") {
  const [checked, setChecked] = useState([]);
  


  // 전체 선택/해제
  const handleAllCheck = (e) => {
    if (e.target.checked) {
      setChecked(items.map((item) => item[key]));
    } else {
      setChecked([]);
    }
  };

  // 개별 선택/해제
  const handleCheck = (id) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return { checked, setChecked, handleAllCheck, handleCheck };
}