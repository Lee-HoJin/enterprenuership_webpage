// src/services/api.js
const API_BASE_URL = 'http://172.29.122.76:3001';

// 기본 fetch 래퍼
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// 사용자 관련 API
export const userAPI = {
  // 회원가입
  register: async (userData) => {
    return await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        createdAt: new Date().toISOString(),
      }),
    });
  },

  // 로그인 (이메일과 비밀번호로 사용자 찾기)
  login: async (email, password) => {
    const users = await apiRequest(`/users?email=${email}&password=${password}`);
    if (users.length > 0) {
      return users[0];
    }
    throw new Error('Invalid credentials');
  },

  // 사용자 정보 조회
  getUser: async (id) => {
    return await apiRequest(`/users/${id}`);
  },

  // 사용자 정보 수정
  updateUser: async (id, userData) => {
    return await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// 게시글 관련 API
export const postAPI = {
  // 모든 게시글 조회
  getAllPosts: async (params = {}) => {
    const queryString = new URLSearchParams();
    
    // 정렬 (최신순)
    queryString.append('_sort', 'createdAt');
    queryString.append('_order', 'desc');
    
    // 필터링
    if (params.type) queryString.append('type', params.type);
    if (params.status) queryString.append('status', params.status);
    if (params.fromBuilding) queryString.append('fromBuilding', params.fromBuilding);
    if (params.toBuilding) queryString.append('toBuilding', params.toBuilding);
    
    // 페이지네이션
    if (params.page) {
      const limit = params.limit || 10;
      queryString.append('_page', params.page);
      queryString.append('_limit', limit);
    }

    return await apiRequest(`/posts?${queryString.toString()}`);
  },

  // 게시글 상세 조회
  getPost: async (id) => {
    return await apiRequest(`/posts/${id}`);
  },

  // 게시글 생성
  createPost: async (postData) => {
    return await apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify({
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        applicants: [],
        status: 'open',
      }),
    });
  },

  // 게시글 수정
  updatePost: async (id, postData) => {
    return await apiRequest(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...postData,
        updatedAt: new Date().toISOString(),
      }),
    });
  },

  // 게시글 삭제
  deletePost: async (id) => {
    return await apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    });
  },

  // 조회수 증가
  incrementViews: async (id) => {
    const post = await apiRequest(`/posts/${id}`);
    return await apiRequest(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        views: post.views + 1,
      }),
    });
  },

  // 검색
  searchPosts: async (query) => {
    return await apiRequest(`/posts?q=${encodeURIComponent(query)}`);
  },
};

// 지원 관련 API
export const applicationAPI = {
  // 지원하기
  apply: async (postId, applicantId, message) => {
    // 1. 지원 정보 생성
    const application = await apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify({
        postId,
        applicantId,
        message,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }),
    });

    // 2. 게시글의 applicants 배열에 추가
    const post = await postAPI.getPost(postId);
    await postAPI.updatePost(postId, {
      applicants: [...post.applicants, applicantId],
    });

    return application;
  },

  // 지원 승인/거절
  updateApplicationStatus: async (applicationId, status) => {
    const application = await apiRequest(`/applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    // 승인된 경우 게시글 상태를 'matched'로 변경
    if (status === 'accepted') {
      await postAPI.updatePost(application.postId, {
        status: 'matched',
      });
    }

    return application;
  },

  // 특정 게시글의 지원자 목록
  getApplicationsByPost: async (postId) => {
    return await apiRequest(`/applications?postId=${postId}`);
  },

  // 특정 사용자의 지원 목록
  getApplicationsByUser: async (userId) => {
    return await apiRequest(`/applications?applicantId=${userId}`);
  },
};

// 기타 API
export const miscAPI = {
  // 건물 목록 조회
  getBuildings: async () => {
    return await apiRequest('/buildings');
  },

  // 통계 정보
  getStats: async () => {
    const posts = await apiRequest('/posts');
    const users = await apiRequest('/users');
    
    return {
      totalPosts: posts.length,
      totalUsers: users.length,
      openRequests: posts.filter(p => p.type === 'help_request' && p.status === 'open').length,
      availableHelpers: posts.filter(p => p.type === 'help_offer' && p.status === 'open').length,
    };
  },
};

// 로컬 스토리지 유틸리티 (로그인 상태 관리)
export const authUtils = {
  setUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  
  removeUser: () => {
    localStorage.removeItem('currentUser');
  },
  
  isLoggedIn: () => {
    return !!localStorage.getItem('currentUser');
  },
};