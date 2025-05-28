import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  Stack,
  CssBaseline
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';

// 더미 게시글 데이터
const initialPosts = [
  {
    id: 1,
    title: 'MUI를 사용한 React 개발 팁',
    content: 'Material-UI를 효과적으로 사용하는 방법에 대해 알아보겠습니다...',
    author: '개발자김씨',
    date: '2025-05-29',
    views: 45,
    category: '개발'
  },
  {
    id: 2,
    title: '웹 디자인 트렌드 2025',
    content: '올해 주목해야 할 웹 디자인 트렌드들을 정리해보았습니다...',
    author: '디자이너박씨',
    date: '2025-05-28',
    views: 32,
    category: '디자인'
  },
  {
    id: 3,
    title: 'JavaScript ES2024 새로운 기능들',
    content: '최신 JavaScript 기능들과 사용법을 알아보겠습니다...',
    author: '코더이씨',
    date: '2025-05-27',
    views: 67,
    category: '개발'
  },
  {
    id: 4,
    title: 'UX/UI 디자인 기초',
    content: '사용자 경험을 향상시키는 디자인 원칙들...',
    author: 'UX전문가',
    date: '2025-05-26',
    views: 23,
    category: '디자인'
  },
  {
    id: 5,
    title: 'React 18의 새로운 기능들',
    content: 'Concurrent Features와 Automatic Batching에 대해...',
    author: '리액트마스터',
    date: '2025-05-25',
    views: 89,
    category: '개발'
  },
];

export default function BoardList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  // 검색 기능
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handlePostClick = (postId) => {
    navigate(`/board/${postId}`);
  };

  const handleWriteClick = () => {
    navigate('/board/write');
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case '개발':
        return 'primary';
      case '디자인':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* 헤더 섹션 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            게시판
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            자유롭게 의견을 나누고 정보를 공유해보세요
          </Typography>
          
          {/* 검색 및 작성 버튼 */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            <TextField
              placeholder="제목, 내용, 작성자로 검색..."
              value={searchTerm}
              onChange={handleSearch}
              sx={{ maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleWriteClick}
              sx={{ minWidth: 120 }}
            >
              글 작성
            </Button>
          </Stack>
        </Box>

        {/* 게시글 목록 */}
        <Grid container spacing={3}>
          {currentPosts.map((post) => (
            <Grid item xs={12} md={6} key={post.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  }
                }}
                onClick={() => handlePostClick(post.id)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={post.category} 
                      color={getCategoryColor(post.category)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <ViewIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">{post.views}</Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" component="h2" gutterBottom>
                    {post.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2
                    }}
                  >
                    {post.content}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption" sx={{ mr: 2 }}>
                      {post.author}
                    </Typography>
                    <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">
                      {post.date}
                    </Typography>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 검색 결과가 없을 때 */}
        {filteredPosts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              검색 결과가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              다른 검색어로 시도해보세요
            </Typography>
          </Box>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {/* 홈으로 돌아가기 버튼 */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
          >
            메인 페이지로 돌아가기
          </Button>
        </Box>
      </Container>
    </AppTheme>
  );
}