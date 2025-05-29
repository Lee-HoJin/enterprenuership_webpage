import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Card, CardContent,
  Chip, Divider, Stack, IconButton, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, CssBaseline, Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon,
  Person as PersonIcon, Schedule as ScheduleIcon, Visibility as ViewIcon,
  ThumbUp as ThumbUpIcon, Share as ShareIcon
} from '@mui/icons-material';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';

export default function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://172.29.122.76:3001/posts/${id}`);
        if (!response.ok) throw new Error('네트워크 응답 실패');
        const data = await response.json();
        setPost({ ...data, views: data.views + 1 }); // 조회수 증가 (프론트에서만)
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
      } finally {
        setLoading(false);
        }
    };

    fetchPost();
  }, [id]);

  const handleBack = () => navigate('/board');
  const handleEdit = () => navigate(`/board/${id}/edit`);
  const handleDeleteClick = () => setDeleteDialogOpen(true);
  const handleDeleteConfirm = () => {
    console.log('게시글 삭제:', id);
    setDeleteDialogOpen(false);
    navigate('/board');
  };

  const handleLike = () => setLiked(!liked);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('URL이 클립보드에 복사되었습니다!');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case '개발': return 'primary';
      case '디자인': return 'secondary';
      default: return 'default';
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
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 3 }}>
          게시판으로 돌아가기
        </Button>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Chip label={post.category} color={getCategoryColor(post.category)} size="small" />
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <ViewIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ mr: 2 }}>{post.views}</Typography>
                <ThumbUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">{post.likes + (liked ? 1 : 0)}</Typography>
              </Box>
            </Stack>

            <Typography variant="h4" component="h1" gutterBottom>
              {post.title}
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" sx={{ mr: 3 }}>{post.author}</Typography>
                <ScheduleIcon sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2">{post.date}</Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <IconButton onClick={handleLike} color={liked ? 'primary' : 'default'}><ThumbUpIcon /></IconButton>
                <IconButton onClick={handleShare}><ShareIcon /></IconButton>
                <IconButton onClick={handleEdit} color="primary"><EditIcon /></IconButton>
                <IconButton onClick={handleDeleteClick} color="error"><DeleteIcon /></IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

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

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" startIcon={<ThumbUpIcon />} onClick={handleLike} color={liked ? 'primary' : 'inherit'}>
            좋아요 {post.likes + (liked ? 1 : 0)}
          </Button>
          <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleShare}>
            공유하기
          </Button>
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
            수정하기
          </Button>
        </Stack>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>게시글 삭제</DialogTitle>
          <DialogContent>
            <DialogContentText>
              정말로 이 게시글을 삭제하시겠습니까?<br />삭제된 게시글은 복구할 수 없습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>삭제</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppTheme>
  );
}
