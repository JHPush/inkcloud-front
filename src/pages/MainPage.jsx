// src/pages/MainPage.jsx
import React, { useEffect, useState } from "react";
import BasicLayout from "../layouts/BasicLayout";
import MainCarousel from "../components/main/MainCarousel";
import BookRankingSection from "../components/main/BookRankingSection";
import { getDailyBestsellers, getWeeklyBestsellers } from "../api/bestsellerApi";
import { getNewBooks, getRecommendedBooks } from "../api/productApi";

// 임시 목업 데이터 (실제 API로 교체 가능)
const mockDailyBooks = [
  { id: 1, title: "자바의 정석", author: "남궁성", image: "https://via.placeholder.com/150" },
  { id: 2, title: "토비의 스프링", author: "이일민", image: "https://via.placeholder.com/150" },
  { id: 3, title: "Effective Java", author: "Joshua Bloch", image: "https://via.placeholder.com/150" },
  { id: 4, title: "클린 코드", author: "Robert C. Martin", image: "https://via.placeholder.com/150" },
];

const mockWeeklyBooks = [
  { id: 5, title: "리팩토링", author: "Martin Fowler", image: "https://via.placeholder.com/150" },
  { id: 6, title: "오브젝트", author: "조영호", image: "https://via.placeholder.com/150" },
  { id: 7, title: "도메인 주도 설계", author: "Eric Evans", image: "https://via.placeholder.com/150" },
  { id: 8, title: "모던 자바 인 액션", author: "Raoul-Gabriel Urma", image: "https://via.placeholder.com/150" },
  { id: 9, title: "스프링 인 액션", author: "Craig Walls", image: "https://via.placeholder.com/150" },
  { id: 10, title: "You Don't Know JS", author: "Kyle Simpson", image: "https://via.placeholder.com/150" },
  { id: 11, title: "Clean Architecture", author: "Robert C. Martin", image: "https://via.placeholder.com/150" },
  { id: 12, title: "The Pragmatic Programmer", author: "Andrew Hunt", image: "https://via.placeholder.com/150" },
  { id: 13, title: "GoF 디자인 패턴", author: "Erich Gamma 외", image: "https://via.placeholder.com/150" },
  { id: 14, title: "자바 ORM 표준 JPA 프로그래밍", author: "김영한", image: "https://via.placeholder.com/150" },
];


const MainPage = () => {
  const [dailyBooks, setDailyBooks] = useState([]);
  const [weeklyBooks, setWeeklyBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  // useEffect(() => {
  //   // 추후 실제 API 호출로 대체
  //   setDailyBooks(mockDailyBooks);
  //   setWeeklyBooks(mockWeeklyBooks);
  // }, []);

  useEffect(() => {
    const fetchMainPageData = async () => {
      try {
        const [daily, weekly, newReleases, recommended] = await Promise.all([
          getDailyBestsellers(),
          getWeeklyBestsellers(),
          getNewBooks(),
          getRecommendedBooks(),
        ]);
        setDailyBooks(daily);
        setWeeklyBooks(weekly);
        setNewBooks(newReleases);
        setRecommendedBooks(recommended);
      } catch (error) {
        console.error("메인 페이지 데이터 로딩 실패:", error);
      }
    };

    fetchMainPageData();
  }, []);

  return (
    <BasicLayout>
      <MainCarousel
        bestsellers={dailyBooks}
        newBooks={newBooks}
        recommendedBooks={recommendedBooks}
      />
      <BookRankingSection weeklyBooks={weeklyBooks} />
    </BasicLayout>
  );
};

export default MainPage;
