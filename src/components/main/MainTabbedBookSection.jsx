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
    <div className="w-full space-y-6">
      {/* 탭 영역 */}
      <div className="tabs justify-center">
        {TABS.map((tab, idx) => (
          <button
            key={idx}
            className={`tab tab-lg tab-bordered ${activeTab === idx ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 카드 Grid 영역 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-4">
        {getCurrentBooks().slice(0, 10).map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default MainTabbedBookSection;
