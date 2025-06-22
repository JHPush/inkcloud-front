// src/components/Main/MainTabbedBookSection.jsx
import React, { useState } from 'react';
import BookCard from './BookCard';

const TABS = ['일간 베스트셀러', '신작 소개', '추천 도서'];

const MainTabbedBookSection = ({ bestsellers = [], newBooks = [], recommendedBooks = [] }) => {
  const [activeTab, setActiveTab] = useState(0);

  const getCurrentBooks = () => {
    switch (activeTab) {
      case 0:
        return bestsellers;
      case 1:
        return newBooks;
      case 2:
        return recommendedBooks;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4 w-full px-4">
      {/* 탭 영역 */}
      <div className="flex space-x-4 border-b pb-2">
        {TABS.map((tab, idx) => (
          <button
            key={idx}
            className={`text-sm font-semibold px-2 pb-1 ${
              activeTab === idx ? 'border-b-2 border-black text-black' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 가로 스크롤 도서 리스트 */}
      <div className="overflow-x-auto whitespace-nowrap py-4">
        {getCurrentBooks().slice(0, 12).map((book) => (
          <div key={book.bookId} className="inline-block align-top mr-4 w-40">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainTabbedBookSection;
