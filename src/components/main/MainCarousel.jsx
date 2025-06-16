// src/components/Main/MainCarousel.jsx
import React, { useState } from 'react';
import BookCard from './BookCard';

const TABS = ['일간 베스트셀러', '신작 소개', '추천 도서'];

const MainCarousel = ({ bestsellers = [], newBooks = [], recommendedBooks = [] }) => {
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
    <div className="w-full space-y-4">
      {/* 탭 */}
      <div className="flex space-x-4 border-b pb-2">
        {TABS.map((tab, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 font-semibold ${
              activeTab === idx ? 'border-b-2 border-black text-black' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 캐러셀 */}
      <div className="overflow-x-auto whitespace-nowrap space-x-4 flex pb-2">
        {getCurrentBooks().map((book) => (
          <div key={book.id} className="inline-block">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCarousel;
