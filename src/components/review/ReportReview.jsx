import { useState } from "react";
import { reportReview } from "../../api/reviewApi";

const REPORT_TYPES = [
  { value: "ABUSE", label: "욕설/비방" },
  { value: "AD", label: "광고/홍보" },
  { value: "SPAM", label: "도배/스팸" },
  { value: "ETC", label: "기타" },
];

const ReportReview = ({ reviewId }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(REPORT_TYPES[0].value);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReport = async (e) => {
    e.preventDefault();
    if (!window.confirm("정말 이 리뷰를 신고하시겠습니까?")) {
      return;
    }
    if (!reason.trim()) {
    window.alert("신고 사유를 입력해주세요.");
    return;
    }

    setLoading(true);
    try {
      await reportReview({ reviewId, type, reason });
      window.alert("신고가 접수되었습니다.");
      setOpen(false);
      setReason("");
      setType(REPORT_TYPES[0].value);

    } catch (err) {
        console.error("error:", err)
      if (err.response && err.response.status === 400) {
        console.log("동일 리뷰 신고 에러")
        window.alert("리뷰 신고는 한번만 가능합니다");
      } else {
        window.alert("신고에 실패했습니다.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="relative inline-block">
      <button
        className="text-xs text-red-500 underline hover:text-red-700"
        onClick={() => setOpen(true)}
      >
        신고
      </button>
      {open && (
        <>
          {/* 오버레이 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setOpen(false)}
          />
          {/* 모달 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 w-80">
              <form onSubmit={handleReport}>
                <div className="mb-2 font-semibold text-gray-700">리뷰 신고</div>
                <select
                  className="w-full border rounded px-2 py-1 mb-2"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {REPORT_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <textarea
                  className="w-full border rounded px-2 py-1 mb-2"
                  rows={3}
                  placeholder="신고 사유를 입력하세요"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded bg-red-500 text-white font-semibold text-xs hover:bg-red-600"
                    disabled={loading}
                  >
                    신고하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportReview;