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
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { userAPI, authUtils } from '../../services/api';

export default function SignUp(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    dormitory: '',
    studentId: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const dormitories = ['1동', '2동', '3동', '4동', '5동', '6동', '7동'];
  const genders = ['남성', '여성'];

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

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요';
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식을 입력해주세요 (010-0000-0000)';
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요';
    }

    if (!formData.dormitory) {
      newErrors.dormitory = '기숙사동을 선택해주세요';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = '학번을 입력해주세요';
    } else if (!/^\d{8}$/.test(formData.studentId)) {
      newErrors.studentId = '8자리 학번을 입력해주세요';
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // 이메일 중복 확인을 위해 기존 사용자 조회
      const response = await fetch(`https://dorm-move-pchec6qkf-hojins-projects-6fa27b7e.vercel.app/api/users?email=${formData.email}`);
      const existingUsers = await response.json();
      
      if (existingUsers.length > 0) {
        setErrors({ email: '이미 가입된 이메일입니다' });
        setLoading(false);
        return;
      }

      // 회원가입 진행
      const newUser = await userAPI.register({
        ...formData,
        createdAt: new Date().toISOString()
      });

      console.log('회원가입 성공:', newUser);
      setSuccess(true);
      
      // 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/signin', { 
          state: { 
            message: '회원가입이 완료되었습니다. 로그인해주세요.',
            email: formData.email 
          }
        });
      }, 2000);

    } catch (error) {
      console.error('회원가입 실패:', error);
      setErrors({ submit: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/signin');
  };

  if (success) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              🎉 회원가입이 완료되었습니다!
            </Alert>
            <Typography variant="h6">
              잠시 후 로그인 페이지로 이동합니다...
            </Typography>
          </Box>
        </Container>
      </AppTheme>
    );
  }

  return (
    <AppTheme {...props}>
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
            로그인으로 돌아가기
          </Button>
          <Typography variant="h3" component="h1" gutterBottom>
            🏠 회원가입
          </Typography>
          <Typography variant="body1" color="text.secondary">
            UNIST 기숙사 이사 도우미 서비스에 가입하세요
          </Typography>
        </Box>

        {/* 회원가입 폼 */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            {errors.submit && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.submit}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                {/* 이름 */}
                <TextField
                  name="name"
                  label="이름"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  required
                  placeholder="홍길동"
                />

                {/* 이메일 */}
                <TextField
                  name="email"
                  label="이메일"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  required
                  placeholder="student@unist.ac.kr"
                />

                {/* 비밀번호 */}
                <TextField
                  name="password"
                  label="비밀번호"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  required
                  placeholder="6자 이상 입력하세요"
                />

                {/* 전화번호 */}
                <TextField
                  name="phone"
                  label="전화번호"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  fullWidth
                  required
                  placeholder="010-0000-0000"
                />

                {/* 성별 */}
                <FormControl fullWidth error={!!errors.gender} required>
                  <InputLabel>성별</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="성별"
                  >
                    {genders.map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.gender && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.gender}
                    </Typography>
                  )}
                </FormControl>

                {/* 기숙사동 */}
                <FormControl fullWidth error={!!errors.dormitory} required>
                  <InputLabel>현재 기숙사동</InputLabel>
                  <Select
                    name="dormitory"
                    value={formData.dormitory}
                    onChange={handleChange}
                    label="현재 기숙사동"
                  >
                    {dormitories.map((dorm) => (
                      <MenuItem key={dorm} value={dorm}>
                        {dorm}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.dormitory && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.dormitory}
                    </Typography>
                  )}
                </FormControl>

                {/* 학번 */}
                <TextField
                  name="studentId"
                  label="학번"
                  value={formData.studentId}
                  onChange={handleChange}
                  error={!!errors.studentId}
                  helperText={errors.studentId}
                  fullWidth
                  required
                  placeholder="20231234"
                />

                {/* 버튼들 */}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleCancel}
                    size="large"
                    disabled={loading}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    size="large"
                    disabled={loading}
                  >
                    {loading ? '가입 중...' : '회원가입'}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* 안내사항 */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            📋 회원가입 안내
          </Typography>
          <Typography variant="body2" component="div">
            • UNIST 학생만 가입 가능합니다<br/>
            • 실명과 올바른 연락처를 입력해주세요<br/>
            • 안전한 거래를 위해 신뢰할 수 있는 정보를 제공해주세요<br/>
            • 가입 후 이사 도움 요청 및 제공 서비스를 이용할 수 있습니다
          </Typography>
        </Box>
      </Container>
    </AppTheme>
  );
}