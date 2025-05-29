import * as React from 'react';
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
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// 게시판 글 미리보기 데이터 (실제로는 API에서 가져올 데이터)
const latestPosts = [
  {
    id: 1,
    title: 'MUI를 사용한 React 개발 팁',
    content: 'Material-UI를 효과적으로 사용하는 방법에 대해 알아보겠습니다. 테마 시스템 활용부터 반응형 디자인까지...',
    author: '개발자김씨',
    date: '2025-05-29',
    views: 45,
    category: '개발'
  },
  {
    id: 2,
    title: '웹 디자인 트렌드 2025',
    content: '올해 주목해야 할 웹 디자인 트렌드들을 정리해보았습니다. 미니멀리즘부터 인터랙티브 요소까지...',
    author: '디자이너박씨',
    date: '2025-05-28',
    views: 32,
    category: '디자인'
  },
  {
    id: 3,
    title: 'JavaScript ES2024 새로운 기능들',
    content: '최신 JavaScript 기능들과 사용법을 알아보겠습니다. 새로운 문법과 성능 개선사항들을...',
    author: '코더이씨',
    date: '2025-05-27',
    views: 67,
    category: '개발'
  },
  {
    id: 4,
    title: 'UX/UI 디자인 기초',
    content: '사용자 경험을 향상시키는 디자인 원칙들을 살펴보겠습니다. 사용성과 접근성을 고려한...',
    author: 'UX전문가',
    date: '2025-05-26',
    views: 23,
    category: '디자인'
  },
  {
    id: 5,
    title: 'React 18의 새로운 기능들',
    content: 'Concurrent Features와 Automatic Batching에 대해 자세히 알아보겠습니다...',
    author: '리액트마스터',
    date: '2025-05-25',
    views: 89,
    category: '개발'
  },
  {
    id: 6,
    title: '모바일 퍼스트 디자인 전략',
    content: '모바일을 우선으로 하는 디자인 접근법과 반응형 웹 구현 방법을 다루겠습니다...',
    author: '모바일전문가',
    date: '2025-05-24',
    views: 54,
    category: '디자인'
  }
];

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

export default function Testimonials() {
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    navigate(`/board/${postId}`);
  };

  const handleViewAllClick = () => {
    navigate('/board');
  };

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
          Latest Posts
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Match your needs here!
        </Typography>
      </Box>

      {/* 게시글 미리보기 카드들 */}
      <Grid 
        container 
        spacing={3} 
        justifyContent="center"
        sx={{ maxWidth: '1200px' }}
      >
        {latestPosts.map((post) => (
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
                {/* 카테고리와 조회수 */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={post.category}
                    color={getCategoryColor(post.category)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <ViewIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    <Typography variant="caption">{post.views}</Typography>
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
                  }}
                >
                  {post.title}
                </Typography>

                {/* 내용 미리보기 */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 2,
                  }}
                >
                  {post.content}
                </Typography>

                {/* 작성자 정보 */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">{post.author}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">{post.date}</Typography>
                  </Box>
                </Stack>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePostClick(post.id);
                  }}
                >
                  See detail
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 게시판 전체 보기 버튼 */}
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
          See all the posts
        </Button>
      </Box>
    </Container>
  );
}