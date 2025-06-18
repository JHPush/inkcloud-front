// src/components/admin/ProductForm.jsx
import React, { useEffect, useState } from "react";
import { createProduct, updateProduct, getPresignedUrl } from "../../api/productApi";
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

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (isEdit) {
      setForm({
        ...product,
        status: product.status?.toUpperCase() || "ON_SALE",
        publicationDate: product.publicationDate || "",
      });
      setImageUrl(product.image || "");
    }
  }, [product, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl("");
      setForm((prev) => ({ ...prev, image: "" }));
    }
  };

  const uploadImageToS3 = async () => {
    if (!imageFile) return null;

    const filename = `${Date.now()}_${imageFile.name}`;
    const presignedUrl = await getPresignedUrl(filename);

    await publicApi.put(presignedUrl, imageFile, {
      headers: {
        "Content-Type": imageFile.type,
        //'x-amz-acl': 'bucket-owner-full-control',
      },
    });

    const uploadedUrl = presignedUrl.split("?")[0];
    setImageUrl(uploadedUrl);
    setForm((prev) => ({ ...prev, image: uploadedUrl }));

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
      payload.publicationDate = payload.publicationDate;
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
      <div className="bg-white p-6 w-full max-w-xl rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "상품 수정" : "상품 등록"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required className="border px-3 py-2 rounded w-full" />
            <input type="text" name="name" placeholder="도서명" value={form.name} onChange={handleChange} required className="border px-3 py-2 rounded w-full" />
            <input type="text" name="author" placeholder="저자" value={form.author} onChange={handleChange} required className="border px-3 py-2 rounded w-full" />
            <input type="text" name="publisher" placeholder="출판사" value={form.publisher} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
            <input type="number" name="price" placeholder="가격" value={form.price} onChange={handleChange} required className="border px-3 py-2 rounded w-full" />
            <input type="number" name="quantity" placeholder="재고 수량" value={form.quantity} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
            <input type="number" name="categoryId" placeholder="카테고리 ID" value={form.categoryId} onChange={handleChange} required className="border px-3 py-2 rounded w-full" />
            <input type="date" name="publicationDate" placeholder="출간일" value={form.publicationDate} onChange={handleChange} required className="border px-3 py-2 rounded w-full" />
            <select name="status" value={form.status} onChange={handleChange} className="border px-3 py-2 rounded w-full">
              <option value="ON_SALE">판매중</option>
              <option value="OUT_OF_STOCK">품절</option>
              <option value="DISCONTINUED">절판</option>
            </select>
          </div>

          <textarea name="introduction" placeholder="도서 소개" value={form.introduction} onChange={handleChange} className="border px-3 py-2 rounded w-full" rows={3} />

          <div>
            <label className="block text-sm font-medium text-gray-700">도서 이미지</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full" />
            {imageUrl ? (
              <img src={imageUrl} alt="미리보기" className="mt-2 h-40 object-cover border rounded" />
            ) : (
              form.image && <img src={form.image} alt="기존 이미지" className="mt-2 h-40 object-cover border rounded" />
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">취소</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
