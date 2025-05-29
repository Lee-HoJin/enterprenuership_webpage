import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function BoardWrite() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '현재사용자' // 실제로는 로그인된 사용자 정보를 사용
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = ['개발', '디자인', '일반', '질문', '공지사항'];

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

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 실제로는 서버에 데이터를 저장
    console.log('게시글 저장:', formData);
    
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/board');
    }, 1500);
  };

  const handleCancel = () => {
    if (formData.title || formData.content) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        navigate('/board');
      }
    } else {
      navigate('/board');
    }
  };

  if (showSuccess) {
    return (
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              게시글이 성공적으로 작성되었습니다!
            </Alert>
            <Typography variant="h6">
              잠시 후 게시판으로 이동합니다...
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
            게시판으로 돌아가기
          </Button>
          <Typography variant="h3" component="h1" gutterBottom>
            새 게시글 작성
          </Typography>
          <Typography variant="body1" color="text.secondary">
            다른 사용자들과 의견을 나누고 정보를 공유해보세요
          </Typography>
        </Box>

        {/* 작성 폼 */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                {/* 카테고리 선택 */}
                <FormControl fullWidth margin="normal" error={!!errors.category}>
                  <InputLabel id="category-label">카테고리</InputLabel>
                  <Select
                    labelId="category-label"
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
                  margin="normal"
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
                  margin="normal"
                  placeholder="게시글 내용을 입력하세요..."
                />

                {/* 작성자 정보 */}
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    작성자: <strong>{formData.author}</strong>
                  </Typography>
                </Box>

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
                    disabled={!formData.title.trim() || !formData.content.trim() || !formData.category}
                  >
                    게시글 작성
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>


        {/* 작성 팁 */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            📝 작성 팁
          </Typography>
          <Typography variant="body2" component="div">
            • 명확하고 구체적인 제목을 작성해주세요<br/>
            • 다른 사용자들이 이해하기 쉽게 내용을 작성해주세요<br/>
            • 적절한 카테고리를 선택해주세요<br/>
            • 건전하고 예의 바른 언어를 사용해주세요
          </Typography>
        </Box>
      </Container>
    </AppTheme>
  );
}