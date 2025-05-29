import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Group as GroupIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

export default function Testimonials() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 컴포넌트 마운트 시 최신 게시글 불러오기
  useEffect(() => {
    loadLatestPosts();
  }, []);

  const loadLatestPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // JSON Server에서 직접 데이터 가져오기
      const response = await fetch('http://172.29.122.76:3001/posts?_sort=createdAt&_order=desc&_limit=6');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('게시글 로딩 실패:', err);
      setError('게시글을 불러오는데 실패했습니다. JSON Server가 실행 중인지 확인해주세요.');
      
      // 에러 발생 시 빈 배열로 설정 (크래시 방지)
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/board/${postId}`);
  };

  const handleViewAllClick = () => {
    navigate('/board');
  };

  const getCategoryColor = (type) => {
    switch (type) {
      case 'help_request':
        return 'error';
      case 'help_offer':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'help_request':
        return '🆘 도움요청';
      case 'help_offer':
        return '💪 도움제공';
      default:
        return '일반';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'success';
      case 'matched':
        return 'warning';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return '모집중';
      case 'matched':
        return '매칭완료';
      case 'completed':
        return '완료';
      default:
        return '알수없음';
    }
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <Container
        id="testimonials"
        sx={{
          pt: { xs: 4, sm: 12 },
          pb: { xs: 8, sm: 16 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Typography variant="h4" gutterBottom>
          최신 게시글
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={30} />
          <Typography variant="body1" color="text.secondary">
            최신 게시글을 불러오는 중...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      {/* 헤더 섹션 */}
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          🏠 최신 이사 도우미 요청
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          기숙사 이사를 도와줄 학생들과 도움이 필요한 학생들을 연결해드려요!
          최신 게시글들을 확인하고 매칭해보세요.
        </Typography>
      </Box>

      {/* 에러 메시지 */}
      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
      )}

      {/* 게시글 미리보기 카드들 */}
      {posts.length > 0 && (
        <Grid 
          container 
          spacing={3} 
          justifyContent="center"
          sx={{ maxWidth: '1200px' }}
        >
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handlePostClick(post.id)}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* 타입과 상태 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <Chip
                      label={getTypeText(post.type)}
                      color={getCategoryColor(post.type)}
                      size="small"
                    />
                    <Chip
                      label={getStatusText(post.status)}
                      color={getStatusColor(post.status)}
                      size="small"
                      variant="outlined"
                    />
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <GroupIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">
                        {post.applicants?.length || 0}명
                      </Typography>
                    </Box>
                  </Box>

                  {/* 제목 */}
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '3rem', // 제목 높이 고정
                    }}
                  >
                    {post.title}
                  </Typography>

                  {/* 이사 정보 (도움요청인 경우만) */}
                  {post.type === 'help_request' && post.fromBuilding && post.toBuilding && (
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {post.fromBuilding} → {post.toBuilding}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                        {post.moveDate && post.moveTime && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {post.moveDate} {post.moveTime}
                            </Typography>
                          </Box>
                        )}
                        {post.price && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MoneyIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {post.price.toLocaleString()}원
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  )}

                  {/* 설명 */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                      minHeight: '2.5rem', // 설명 높이 고정
                    }}
                  >
                    {post.description || '설명이 없습니다.'}
                  </Typography>

                  {/* 작성자 정보 */}
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">
                        {post.authorName} ({post.authorGender})
                      </Typography>
                    </Box>
                    {post.authorPhone && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">
                          {post.authorPhone.slice(0, -4)}****
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </Typography>
                  <Box sx={{ ml: 'auto' }}>
                    <Typography variant="caption" color="text.secondary">
                      조회 {post.views || 0}
                    </Typography>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 게시글이 없을 때 */}
      {posts.length === 0 && !loading && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            😅 아직 게시글이 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            첫 번째 이사 도우미 게시글을 작성해보세요!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/board/write')}
            sx={{ mr: 2 }}
          >
            글 작성하기
          </Button>
        </Box>
      )}

      {/* 게시판 전체 보기 버튼 */}
      {posts.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={handleViewAllClick}
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            게시판 전체 보기
          </Button>
        </Box>
      )}

      {/* 새로고침 버튼 (에러 발생 시) */}
      {error && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="text"
            onClick={loadLatestPosts}
            color="primary"
          >
            다시 시도
          </Button>
        </Box>
      )}
    </Container>
  );
}