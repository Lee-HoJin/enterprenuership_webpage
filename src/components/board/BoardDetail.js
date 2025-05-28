import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CssBaseline,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  ThumbUp as ThumbUpIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';

// 더미 게시글 데이터 (실제로는 API에서 가져올 데이터)
const postData = {
  1: {
    id: 1,
    title: 'MUI를 사용한 React 개발 팁',
    content: `Material-UI를 효과적으로 사용하는 방법에 대해 알아보겠습니다.

## 1. 테마 시스템 활용하기

MUI의 테마 시스템을 사용하면 일관성 있는 디자인을 쉽게 구현할 수 있습니다. ThemeProvider를 사용해서 전역 스타일을 관리하고, 커스텀 테마를 만들어 브랜드에 맞는 색상과 타이포그래피를 적용할 수 있습니다.

## 2. 반응형 디자인

MUI의 Grid 시스템과 Breakpoint를 활용하면 모바일부터 데스크톱까지 완벽하게 대응하는 반응형 웹사이트를 만들 수 있습니다.

## 3. 컴포넌트 커스터마이징

styled() 함수나 sx prop을 사용해서 기본 MUI 컴포넌트를 프로젝트에 맞게 커스터마이징할 수 있습니다.

이러한 방법들을 통해 효율적이고 아름다운 React 애플리케이션을 개발할 수 있습니다.`,
    author: '개발자김씨',
    date: '2025-05-29',
    views: 45,
    category: '개발',
    likes: 12
  },
  2: {
    id: 2,
    title: '웹 디자인 트렌드 2025',
    content: '올해 주목해야 할 웹 디자인 트렌드들을 정리해보았습니다...',
    author: '디자이너박씨',
    date: '2025-05-28',
    views: 32,
    category: '디자인',
    likes: 8
  },
  // 다른 게시글들...
};

export default function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져옴
    setTimeout(() => {
      const foundPost = postData[id];
      if (foundPost) {
        setPost(foundPost);
        // 조회수 증가 (실제로는 서버에서 처리)
        foundPost.views += 1;
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleBack = () => {
    navigate('/board');
  };

  const handleEdit = () => {
    navigate(`/board/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // 실제로는 서버에서 삭제 처리
    console.log('게시글 삭제:', id);
    setDeleteDialogOpen(false);
    navigate('/board');
  };

  const handleLike = () => {
    setLiked(!liked);
    // 실제로는 서버에 좋아요 상태 전송
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      // 클립보드에 URL 복사
      navigator.clipboard.writeText(window.location.href);
      alert('URL이 클립보드에 복사되었습니다!');
    }
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

  if (loading) {
    return (
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Typography variant="h6" textAlign="center">
            게시글을 불러오는 중...
          </Typography>
        </Container>
      </AppTheme>
    );
  }

  if (!post) {
    return (
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            게시글을 찾을 수 없습니다.
          </Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
            게시판으로 돌아가기
          </Button>
        </Container>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      
      <Container maxWidth="md" sx={{ py: 8 }}>
        {/* 뒤로 가기 버튼 */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          게시판으로 돌아가기
        </Button>

        {/* 게시글 헤더 */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* 카테고리와 메타 정보 */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Chip 
                label={post.category} 
                color={getCategoryColor(post.category)}
                size="small"
              />
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <ViewIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ mr: 2 }}>
                  {post.views}
                </Typography>
                <ThumbUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">
                  {post.likes + (liked ? 1 : 0)}
                </Typography>
              </Box>
            </Stack>

            {/* 제목 */}
            <Typography variant="h4" component="h1" gutterBottom>
              {post.title}
            </Typography>

            {/* 작성자 정보 */}
            <Stack 
              direction="row" 
              alignItems="center" 
              justifyContent="space-between"
              sx={{ color: 'text.secondary' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" sx={{ mr: 3 }}>
                  {post.author}
                </Typography>
                <ScheduleIcon sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2">
                  {post.date}
                </Typography>
              </Box>

              {/* 액션 버튼들 */}
              <Stack direction="row" spacing={1}>
                <IconButton 
                  onClick={handleLike}
                  color={liked ? 'primary' : 'default'}
                >
                  <ThumbUpIcon />
                </IconButton>
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
                <IconButton onClick={handleEdit} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDeleteClick} color="error">
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* 게시글 내용 */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="body1" 
              component="div"
              sx={{ 
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
                '& h2': {
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  mt: 3,
                  mb: 2,
                  color: 'primary.main'
                }
              }}
            >
              {post.content}
            </Typography>
          </CardContent>
        </Card>

        <Divider sx={{ my: 4 }} />

        {/* 하단 액션 버튼들 */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<ThumbUpIcon />}
            onClick={handleLike}
            color={liked ? 'primary' : 'inherit'}
          >
            좋아요 {post.likes + (liked ? 1 : 0)}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShare}
          >
            공유하기
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            수정하기
          </Button>
        </Stack>

        {/* 삭제 확인 다이얼로그 */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>게시글 삭제</DialogTitle>
          <DialogContent>
            <DialogContentText>
              정말로 이 게시글을 삭제하시겠습니까?<br/>
              삭제된 게시글은 복구할 수 없습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppTheme>
  );
}