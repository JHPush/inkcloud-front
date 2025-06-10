

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
    <button type="button" onClick={handleSearch} className="btn btn-secondary">
      주소 검색
    </button>
  );
};

export default KakaoAddress;