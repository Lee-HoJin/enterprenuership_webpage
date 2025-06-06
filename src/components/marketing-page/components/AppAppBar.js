import * as React from 'react';
import { useNavigate } from 'react-router-dom'; // 추가
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const navigate = useNavigate(); // 추가
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // 페이지 내 섹션으로 스크롤하는 함수
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 로그인 페이지로 이동
  const handleSignIn = () => {
    navigate('/signin');
  };

  // 회원가입 페이지로 이동
  const handleSignUp = () => {
    navigate('/signup');
  };

  // 모바일 메뉴에서 로그인/회원가입 후 drawer 닫기
  const handleMobileSignIn = () => {
    setOpen(false);
    navigate('/signin');
  };

  const handleMobileSignUp = () => {
    setOpen(false);
    navigate('/signup');
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Sitemark />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                onClick={() => navigate('/board')}
              >
                Posts
              </Button>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                onClick={() => scrollToSection('testimonials')}
              >
                Preview
              </Button>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                onClick={() => scrollToSection('pricing')}
              >
                Pricing
              </Button>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                onClick={() => navigate('/board')}
              >
                About Service
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button 
              color="primary" 
              variant="text" 
              size="small"
              onClick={handleSignIn}
            >
              Sign in
            </Button>
            <Button 
              color="primary" 
              variant="contained" 
              size="small"
              onClick={handleSignUp}
            >
              Sign up
            </Button>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem onClick={() => { setOpen(false); navigate('/board'); }}>
                  Posts
                </MenuItem>
                <MenuItem onClick={() => { setOpen(false); scrollToSection('testimonials'); }}>
                  Preview
                </MenuItem>
                <MenuItem onClick={() => { setOpen(false); scrollToSection('pricing'); }}>
                  Pricing
                </MenuItem>
                <MenuItem onClick={() => { setOpen(false); navigate('/about'); }}>
                  About Service
                </MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button 
                    color="primary" 
                    variant="contained" 
                    fullWidth
                    onClick={handleMobileSignUp}
                  >
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button 
                    color="primary" 
                    variant="outlined" 
                    fullWidth
                    onClick={handleMobileSignIn}
                  >
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}