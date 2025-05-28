import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack,
  CssBaseline,
  Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';

export default function BoardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ['개발', '디자인', '일반', '질문', '공지사항'];

  useEffect(() => {
    // 실제로는 API에서 기존 게시글 데이터를 가져옴
    const fetchPost = async () => {
      setTimeout(() => {
        // 더미 데이터
        const postData = {
          id: parseInt(id),
          title: 'MUI를 사용한 React 개발 팁',
          content: `Material-UI를 효과적으로 사용하는 방법에 대해 알아보겠습니다.

## 1. 테마 시스템 활용하기

MUI의 테마 시스템을 사용하면 일관성 있는 디자인을 쉽게 구현할 수 있습니다.

## 2. 반응형 디자인

MUI의 Grid 시스템과 Breakpoint를 활용하면 완벽한 반응형 웹사이트를 만들 수 있습니다.`,
          category: '개발',
          author: '개발자김씨'
        };
        
        setFormData(postData);
        setOriginalData(postData);
        setLoading(false);
      }, 500);
    };

    fetchPost();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    } else if (formData.title.length > 100) {
      newErrors.title = '제목은 100자 이내로 입력해주세요';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요';
    } else if (formData.content.length < 10) {
      newErrors.content = '내용은 10자 이상 입력해주세요';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요';
    }

    return newErrors;
  };

  const hasChanges = () => {
    return (
      formData.title !== originalData.title ||
      formData.content !== originalData.content ||
      formData.category !== originalData.category
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 실제로는 서버에 수정된 데이터를 저장
    console.log('게시글 수정:', formData);
    
    setShowSuccess(true);
    setTimeout(() => {
      navigate(`/board/${id}`);
    }, 1500);
  };

  const handleCancel = () => {
    if (hasChanges()) {
      if (window.confirm('수정 사항이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
        navigate(`/board/${id}`);
      }
    } else {
      navigate(`/board/${id}`);
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

  if (showSuccess) {
    return (
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              게시글이 성공적으로 수정되었습니다!
            </Alert>
            <Typography variant="h6">
              잠시 후 게시글로 이동합니다...
            </Typography>
          </Box>
        </Container>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      
      <Container maxWidth="md" sx={{ py: 8 }}>
        {/* 헤더 */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            sx={{ mb: 2 }}
          >
            게시글로 돌아가기
          </Button>
          <Typography variant="h3" component="h1" gutterBottom>
            게시글 수정
          </Typography>
          <Typography variant="body1" color="text.secondary">
            게시글 내용을 수정하세요
          </Typography>
        </Box>

        {/* 수정 폼 */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                {/* 작성자 정보 (수정 불가) */}
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    작성자: <strong>{formData.author}</strong>
                  </Typography>
                </Box>

                {/* 카테고리 선택 */}
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>카테고리</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="카테고리"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>

                {/* 제목 입력 */}
                <TextField
                  name="title"
                  label="제목"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title || `${formData.title.length}/100`}
                  fullWidth
                  required
                  placeholder="게시글 제목을 입력하세요"
                />

                {/* 내용 입력 */}
                <TextField
                  name="content"
                  label="내용"
                  value={formData.content}
                  onChange={handleChange}
                  error={!!errors.content}
                  helperText={errors.content || `${formData.content.length}자`}
                  fullWidth
                  multiline
                  rows={12}
                  required
                  placeholder="게시글 내용을 입력하세요..."
                />

                {/* 변경 사항 알림 */}
                {hasChanges() && (
                  <Alert severity="info">
                    수정 사항이 있습니다. 저장하지 않으면 변경 내용이 사라집니다.
                  </Alert>
                )}

                {/* 버튼들 */}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleCancel}
                    size="large"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    size="large"
                    disabled={!hasChanges() || !formData.title.trim() || !formData.content.trim() || !formData.category}
                  >
                    수정 완료
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* 수정 가이드 */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'warning.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            ⚠️ 수정 시 주의사항
          </Typography>
          <Typography variant="body2" component="div">
            • 수정된 게시글은 즉시 다른 사용자들에게 보여집니다<br/>
            • 제목과 내용을 신중하게 검토해주세요<br/>
            • 카테고리가 변경되면 게시글 분류가 바뀝니다<br/>
            • 저장하지 않고 페이지를 나가면 변경사항이 사라집니다
          </Typography>
        </Box>
      </Container>
    </AppTheme>
  );
}