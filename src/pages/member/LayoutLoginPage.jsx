import BasicLayout from "../../layouts/BasicLayout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import LoginPage from "../../components/menus/LoginPage";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { Home } from 'lucide-react';
import logo from "../../assets/logo.png"; // 로고 경로 확인 필요

const LayoutLoginPage = () => {
  const theme = useTheme();
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const user = useSelector(state => state.login.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (user?.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      justifyContent: "center",
      position: "relative",
      py: 4
    }}>
      {/* 상단 헤더 - 로고와 홈 버튼 */}
      <Box 
        sx={{ 
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box component="img" src={logo} alt="InkCloud Logo" sx={{ height: 40 }} />
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Home size={20} />} // size 속성으로 크기 조절 가능
          onClick={handleGoHome}
          sx={{ borderRadius: 2 }}
        >
          메인으로
        </Button>
      </Box>

      {/* 로그인 컴포넌트 */}
      <Box sx={{ my: 4, width: "100%" }}>
        <LoginPage />
      </Box>

      {/* 간단한 푸터 */}
      <Box 
        sx={{ 
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: "center", 
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} InkCloud. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default LayoutLoginPage;