import React, { useEffect, useState, useRef } from "react";
import {
  createProduct,
  updateProduct,
  getPresignedUrl,
  fetchAllCategories,
} from "../../api/productApi";
import publicApi from "../../api/publicApi";

const ProductForm = ({ product, onClose }) => {
  const isEdit = !!product;

  const [form, setForm] = useState({
    isbn: "",
    name: "",
    author: "",
    publisher: "",
    price: 0,
    quantity: 0,
    status: "ON_SALE",
    introduction: "",
    image: "",
    categoryId: "",
    publicationDate: "",
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEdit) {
      setForm({
        ...product,
        status: product.status?.toUpperCase() || "ON_SALE",
        publicationDate: product.publicationDate || "",
      });
      setImageUrl(product.image || "");
    }
    fetchCategories();
  }, [product, isEdit]);

  const fetchCategories = async () => {
    try {
      const res = await fetchAllCategories();
      setCategories(res);
    } catch (error) {
      console.error("카테고리 불러오기 실패", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToS3 = async () => {
    if (!imageFile) return null;

    const filename = `${Date.now()}_${imageFile.name}`;
    const presignedUrl = await getPresignedUrl(filename);

    await publicApi.put(presignedUrl, imageFile, {
      headers: { "Content-Type": imageFile.type },
    });

    const uploadedUrl = presignedUrl.split("?")[0];
    return uploadedUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrlToUse = form.image;
      if (imageFile) {
        const uploaded = await uploadImageToS3();
        imageUrlToUse = uploaded;
      }

      const { id, ...payload } = form;
      payload.price = Number(payload.price);
      payload.quantity = Number(payload.quantity);
      payload.categoryId = Number(payload.categoryId);
      payload.image = imageUrlToUse;

      if (isEdit) {
        await updateProduct(id, payload);
        alert("상품이 수정되었습니다.");
      } else {
        await createProduct(payload);
        alert("상품이 등록되었습니다.");
      }
      onClose();
    } catch (error) {
      console.error("상품 저장 실패", error);
      alert("상품 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-3xl rounded shadow">
        <h2 className="text-xl font-bold mb-4">{isEdit ? "상품 수정" : "상품 등록"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Left: Image Upload & Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">도서 이미지</label>
            <div
              className="w-full h-56 border rounded flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => fileInputRef.current.click()}
            >
              {imageUrl || form.image ? (
                <img src={imageUrl || form.image} alt="preview" className="h-full object-contain" />
              ) : (
                <span className="text-gray-400">이미지를 클릭해 등록하세요</span>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <label className="block mt-4 text-sm font-medium text-gray-700">상품 상태</label>
            <select name="status" value={form.status} onChange={handleChange} className="mt-1 border rounded px-3 py-2 w-full">
              <option value="ON_SALE">판매중</option>
              <option value="OUT_OF_STOCK">품절</option>
              <option value="DISCONTINUED">절판</option>
            </select>
          </div>

          {/* Right: Text Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700">ISBN</label>
              <input name="isbn" value={form.isbn} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
            </div>
            <div>
              <label className="block text-sm text-gray-700">도서명</label>
              <input name="name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
            </div>
            <div>
              <label className="block text-sm text-gray-700">저자</label>
              <input name="author" value={form.author} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
            </div>
            <div>
              <label className="block text-sm text-gray-700">출판사</label>
              <input name="publisher" value={form.publisher} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-700">가격</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
              </div>
              <div>
                <label className="block text-sm text-gray-700">재고량</label>
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700">카테고리</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
                <option value="">카테고리를 선택하세요</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700">출간일</label>
              <input type="date" name="publicationDate" value={form.publicationDate} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
            </div>
          </div>

          {/* Full Width: Introduction & Buttons */}
          <div className="col-span-2">
            <label className="block text-sm text-gray-700">도서 소개</label>
            <textarea name="introduction" value={form.introduction} onChange={handleChange} className="border rounded px-3 py-2 w-full" rows={4} />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">취소</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">저장</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
