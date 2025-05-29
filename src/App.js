import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 컴포넌트들 import
import MarketingPage from './components/marketing-page/MarketingPage';
import SignIn from './components/sign-in/SignIn';
import SignUp from './components/sign-up/SignUp';
import SignInSide from './components/sign-in-side/SignInSide';
import AppTheme from './components/shared-theme/AppTheme';

// 게시판 컴포넌트들 import
import BoardList from './components/board/BoardList';
import BoardWrite from './components/board/BoardWrite';
import BoardDetail from './components/board/BoardDetail';
import BoardEdit from './components/board/BoardEdit';

function App() {
  return (  
    <AppTheme>
      <CssBaseline />
      <Router> 
        <Routes>
          {/* 메인 페이지 - 마케팅 페이지 */} 
          <Route path="/" element={<MarketingPage />} />
          
          {/* 로그인 페이지들 */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signin-side" element={<SignInSide />} />
          
          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<SignUp />} />
          
          {/* 게시판 페이지들 */}
          <Route path="/board" element={<BoardList />} /> 
          <Route path="/board/write" element={<BoardWrite />} />
          <Route path="/board/:id" element={<BoardDetail />} />
          <Route path="/board/:id/edit" element={<BoardEdit />} />
          
          {/* 기본 경로를 메인 페이지로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppTheme>
  );
}

export default App;