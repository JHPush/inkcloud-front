const KakaoAddress = ({ onComplete }) => {
  const handleSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        // data.zonecode: 우편번호, data.address: 도로명 주소
        onComplete({
          zipcode: data.zonecode,
          addressMain: data.address,
        });
      },
    }).open();
  };

  return (
    <button
      type="button"
      onClick={handleSearch}
      className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-700  transition"
    >
    검색
    </button>
  );
};

export default KakaoAddress;