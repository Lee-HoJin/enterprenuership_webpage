import React, { useState, useEffect } from 'react';
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
  Pagination,
  Stack,
  CssBaseline,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { postAPI, miscAPI, authUtils } from '../../services/api';

export default function BoardList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tabValue, setTabValue] = useState(0); // 0: 전체, 1: 도움요청, 2: 도움제공
  const [buildingFilter, setBuildingFilter] = useState('');
  const [buildings, setBuildings] = useState([]);
  const postsPerPage = 6;

  // 현재 로그인한 사용자
  const currentUser = authUtils.getUser();

  // 데이터 불러오기
  useEffect(() => {
    loadPosts();
    loadBuildings();
  }, [tabValue, buildingFilter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      // 탭에 따른 필터링
      if (tabValue === 1) params.type = 'help_request';
      if (tabValue === 2) params.type = 'help_offer';
      
      // 건물 필터링
      if (buildingFilter) {
        params.fromBuilding = buildingFilter;
      }

      const data = await postAPI.getAllPosts(params);
      setPosts(data);
    } catch (err) {
      setError('게시글을 불러올 수 없습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadBuildings = async () => {
    try {
      const data = await miscAPI.getBuildings();
      setBuildings(data);
    } catch (err) {
      console.error('건물 정보를 불러오는데 실패했습니다.');
    }
  };

  // 검색 기능
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.fromBuilding.includes(searchTerm) ||
    post.toBuilding.includes(searchTerm)
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1);
  };

  const handlePostClick = (postId) => {
    navigate(`/board/${postId}`);
  };

  const handleWriteClick = () => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      navigate('/signin');
      return;
    }
    navigate('/board/write');
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

  const getTypeText = (type) => {
    return type === 'help_request' ? '도움요청' : '도움제공';
  };

  const getTypeColor = (type) => {
    return type === 'help_request' ? 'error' : 'primary';
  };

  if (loading) {
    return (
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            게시글을 불러오는 중...
          </Typography>
        </Container>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* 헤더 섹션 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            🏠 기숙사 이사 도우미
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            이사할 때 도움이 필요하거나, 알바로 도와줄 수 있는 분들을 연결해드려요!
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* 탭 메뉴 */}
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            sx={{ mb: 3 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="전체" />
            <Tab label="🆘 도움요청" />
            <Tab label="💪 도움제공" />
          </Tabs>
          
          {/* 검색 및 필터 */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flex: 1 }}>
              <TextField
                placeholder="제목, 내용, 건물명으로 검색..."
                value={searchTerm}
                onChange={handleSearch}
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>건물 필터</InputLabel>
                <Select
                  value={buildingFilter}
                  onChange={(e) => setBuildingFilter(e.target.value)}
                  label="건물 필터"
                >
                  <MenuItem value="">전체</MenuItem>
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.name}>
                      {building.name} ({building.type})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            
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
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* 상태와 타입 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <Chip 
                      label={getTypeText(post.type)} 
                      color={getTypeColor(post.type)}
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
                        {post.applicants?.length || 0}명 지원
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" component="h2" gutterBottom>
                    {post.title}
                  </Typography>

                  {/* 이사 정보 */}
                  {post.type === 'help_request' && (
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {post.fromBuilding} {post.fromRoom} → {post.toBuilding} {post.toRoom}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {post.moveDate} {post.moveTime}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MoneyIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {post.price?.toLocaleString()}원
                          </Typography>
                        </Box>
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
                      mb: 2
                    }}
                  >
                    {post.description}
                  </Typography>

                  {/* 작성자 정보 */}
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">
                        {post.authorName} ({post.authorGender})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">
                        {post.authorPhone?.slice(0, -4)}****
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ ml: 'auto' }}>
                    <Typography variant="caption" color="text.secondary">
                      조회 {post.views}
                    </Typography>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 검색 결과가 없을 때 */}
        {filteredPosts.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              😅 검색 결과가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              다른 검색어나 필터를 시도해보세요
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